use std::path::{Path, PathBuf};

use anyhow::{anyhow, Result};
use git2::{Cred, Direction, IndexAddOption, PushOptions, RemoteCallbacks, Repository, Signature};
use log::{debug, error};

/// # Utilities for interacting with git
/// Wrapper on top of `git2` library
pub struct GitUtils {
  repository: Repository,
}

impl GitUtils {
  /// # Create a new GitUtils instance
  ///
  /// - Inits a new git repo.
  /// - Sets the repository remote.
  pub fn new(remote_url: String, repo_path: &Path) -> Result<Self> {
    let repository = Repository::init(repo_path)?;
    repository.remote("origin", &remote_url)?;
    Ok(Self { repository })
  }

  /// # Get Ref Spec String
  ///
  /// Get Ref Spec string from `branch` name.
  pub fn get_ref_specs(branch: &str) -> String {
    format!("refs/heads/{}:refs/heads/{}", branch, branch)
  }

  /// # Load GitUtils instance based on existing repo
  ///
  /// - Loads an existing instance of the git repository at
  /// the `repo_path` and returns a GitUtils instance based on this.
  pub fn load(repo_path: &Path) -> Result<Self> {
    let repository = Repository::open(repo_path)?;
    Ok(Self { repository })
  }

  /// # Clone a repo
  ///
  /// Clones a repository given the `remote_url` to the specified `path`
  pub fn clone(remote_url: String, clone_path: &Path) -> Result<Repository> {
    // Prepare callbacks.
    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
      Cred::ssh_key_from_agent(username_from_url.unwrap())
    });
    // Prepare fetch options.
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(callbacks);
    // Prepare builder.
    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(fo);
    // Clone the project and get the repository instance
    let repository = builder.clone(&remote_url, clone_path)?;
    Ok(repository)
  }

  /// # Add files to track
  ///
  /// Add all files to track under the specified `dirs` list.
  pub fn add(&self, dirs: Vec<&Path>) -> Result<()> {
    let mut index = self.repository.index()?;
    index.add_all(dirs.iter(), IndexAddOption::DEFAULT, None)?;
    index.write()?;
    Ok(())
  }

  /// # Add + Commit to repo
  ///
  /// Create a commit adding and tracking the files to the repo.
  /// - `dirs` path to add files to commit
  ///
  /// ## References
  ///
  /// - https://github.com/rust-lang/git2-rs/issues/507
  pub fn add_commit(&self, dirs: Vec<&Path>, message: &str) -> Result<()> {
    self.add(dirs)?; // add files to commit on the specified dir_path
    let signature = self.repository.signature()?;
    let tree_id = self.repository.index()?.write_tree()?;
    let mut parents = Vec::new();
    if let Some(parent) = self.repository.head().ok().map(|h| h.target().unwrap()) {
      parents.push(self.repository.find_commit(parent)?);
    }
    let parents = parents.iter().collect::<Vec<_>>();
    self.repository.commit(
      Some("HEAD"),
      &signature,
      &signature,
      message,
      &self.repository.find_tree(tree_id)?,
      &parents,
    )?;
    Ok(())
  }

  /// # Create Callbacks for Git SSH Auth
  pub fn create_callbacks<'a>() -> RemoteCallbacks<'a> {
    // Prepare callbacks.
    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
      debug!("username_from_url: {:?}", username_from_url);
      Cred::ssh_key_from_agent(username_from_url.unwrap())
    });
    callbacks
  }

  /// # Push changes to remote
  ///
  /// Push committed changes to remote repository.
  ///
  /// ## References
  ///
  /// - https://stackoverflow.com/questions/58201849/request-failed-with-status-code-401-error-when-trying-to-push-to-remote-using
  pub fn push(&self) -> Result<()> {
    let mut remote = self.repository.find_remote("origin")?;
    let mut callbacks = Self::create_callbacks();
    let mut is_error = false; // for checking if any error is present
    let mut push_options = PushOptions::default();
    callbacks.push_update_reference(move |reference, error| {
      // check for errors in update refs
      if error.is_some() {
        error!("ref = {}, error = {:?}", reference, error);
        is_error = is_error || error.is_some();
      }
      Ok(())
    });
    remote.connect_auth(Direction::Push, Some(Self::create_callbacks()), None)?;
    let ref_spec = Self::get_ref_specs("master");
    self.repository.remote_add_push("origin", &ref_spec)?;
    push_options.remote_callbacks(callbacks);
    remote.push(&[&ref_spec], Some(&mut push_options))?;
    if is_error {
      return Err(anyhow!("push_update_reference() has reported errors!"));
    }
    Ok(())
  }

  /// # Fetch a repo
  ///
  /// Downloads data from remote repo and updates existing files.
  /// - `refs`: Update references
  /// - `remote`: Remote to fetch from
  ///
  /// ## Reference
  ///
  /// - https://github.com/rust-lang/git2-rs/blob/master/examples/pull.rs
  ///
  fn do_fetch<'a>(
    &'a self,
    refs: &[&str],
    remote: &'a mut git2::Remote,
  ) -> Result<git2::AnnotatedCommit<'a>, git2::Error> {
    let mut cb = Self::create_callbacks();
    // Print out our transfer progress.
    cb.transfer_progress(|stats| {
      if stats.received_objects() == stats.total_objects() {
        debug!(
          "Resolving deltas {}/{}\r",
          stats.indexed_deltas(),
          stats.total_deltas()
        );
      } else if stats.total_objects() > 0 {
        debug!(
          "Received {}/{} objects ({}) in {} bytes\r",
          stats.received_objects(),
          stats.total_objects(),
          stats.indexed_objects(),
          stats.received_bytes()
        );
      }
      true
    });
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(cb);
    // Always fetch all tags.
    // Perform a download and also update tips
    fo.download_tags(git2::AutotagOption::All);
    debug!("Fetching {} for repo", remote.name().unwrap());
    remote.fetch(refs, Some(&mut fo), None)?;
    // If there are local objects (we got a thin pack), then tell the user
    // how many objects we saved from having to cross the network.
    let stats = remote.stats();
    if stats.local_objects() > 0 {
      debug!(
        "\rReceived {}/{} objects in {} bytes (used {} local \
             objects)",
        stats.indexed_objects(),
        stats.total_objects(),
        stats.received_bytes(),
        stats.local_objects()
      );
    } else {
      debug!(
        "\rReceived {}/{} objects in {} bytes",
        stats.indexed_objects(),
        stats.total_objects(),
        stats.received_bytes()
      );
    }
    let fetch_head = self.repository.find_reference("FETCH_HEAD")?;
    Ok(self.repository.reference_to_annotated_commit(&fetch_head)?)
  }

  /// # Merge: fast_forward
  ///
  /// ## Reference
  ///
  /// - https://github.com/rust-lang/git2-rs/blob/master/examples/pull.rs
  ///
  fn fast_forward(
    &self,
    lb: &mut git2::Reference,
    rc: &git2::AnnotatedCommit,
  ) -> Result<(), git2::Error> {
    let name = match lb.name() {
      Some(s) => s.to_string(),
      None => String::from_utf8_lossy(lb.name_bytes()).to_string(),
    };
    let msg = format!("Fast-Forward: Setting {} to id: {}", name, rc.id());
    debug!("{}", msg);
    lb.set_target(rc.id(), &msg)?;
    self.repository.set_head(&name)?;
    self.repository.checkout_head(Some(
      git2::build::CheckoutBuilder::default()
        // For some reason the force is required to make the working directory actually get updated
        // I suspect we should be adding some logic to handle dirty working directory states
        // but this is just an example so maybe not.
        .force(),
    ))?;
    Ok(())
  }

  /// # Merge: normal
  ///
  /// ## Reference
  ///
  /// - https://github.com/rust-lang/git2-rs/blob/master/examples/pull.rs
  ///
  fn normal_merge(
    &self,
    local: &git2::AnnotatedCommit,
    remote: &git2::AnnotatedCommit,
  ) -> Result<(), git2::Error> {
    let local_tree = self.repository.find_commit(local.id())?.tree()?;
    let remote_tree = self.repository.find_commit(remote.id())?.tree()?;
    let ancestor = self
      .repository
      .find_commit(self.repository.merge_base(local.id(), remote.id())?)?
      .tree()?;
    let mut idx = self
      .repository
      .merge_trees(&ancestor, &local_tree, &remote_tree, None)?;
    if idx.has_conflicts() {
      debug!("Merge conficts detected...");
      self.repository.checkout_index(Some(&mut idx), None)?;
      return Ok(());
    }
    let result_tree = self
      .repository
      .find_tree(idx.write_tree_to(&self.repository)?)?;
    // now create the merge commit
    let msg = format!("Merge: {} into {}", remote.id(), local.id());
    let sig = self.repository.signature()?;
    let local_commit = self.repository.find_commit(local.id())?;
    let remote_commit = self.repository.find_commit(remote.id())?;
    // Do our merge commit and set current branch head to that commit.
    let _merge_commit = self.repository.commit(
      Some("HEAD"),
      &sig,
      &sig,
      &msg,
      &result_tree,
      &[&local_commit, &remote_commit],
    )?;
    // Set working tree to match head.
    self.repository.checkout_head(None)?;
    Ok(())
  }

  fn do_merge<'a>(
    &self,
    remote_branch: &str,
    fetch_commit: git2::AnnotatedCommit<'a>,
  ) -> Result<(), git2::Error> {
    // 1. do a merge analysis
    let analysis = self.repository.merge_analysis(&[&fetch_commit])?;
    // 2. Do the appropriate merge
    if analysis.0.is_fast_forward() {
      debug!("Doing a fast forward");
      // do a fast forward
      let refname = format!("refs/heads/{}", remote_branch);
      match self.repository.find_reference(&refname) {
        Ok(mut r) => {
          self.fast_forward(&mut r, &fetch_commit)?;
        }
        Err(_) => {
          // The branch doesn't exist so just set the reference to the
          // commit directly. Usually this is because you are pulling
          // into an empty repository.
          self.repository.reference(
            &refname,
            fetch_commit.id(),
            true,
            &format!("Setting {} to {}", remote_branch, fetch_commit.id()),
          )?;
          self.repository.set_head(&refname)?;
          self.repository.checkout_head(Some(
            git2::build::CheckoutBuilder::default()
              .allow_conflicts(true)
              .conflict_style_merge(true)
              .force(),
          ))?;
        }
      };
    } else if analysis.0.is_normal() {
      // do a normal merge
      let head_commit = self
        .repository
        .reference_to_annotated_commit(&self.repository.head()?)?;
      self.normal_merge(&head_commit, &fetch_commit)?;
    } else {
      debug!("Nothing to do...");
    }
    Ok(())
  }

  /// # Pull a repo
  ///
  /// Downloads data from remote repo and updates existing files.
  pub fn pull(&self) -> Result<()> {
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(Self::create_callbacks());
    let ref_spec = Self::get_ref_specs("master");
    let mut remote = self.repository.find_remote("origin")?;
    let fetch_commit = self.do_fetch(&[ref_spec.as_str()], &mut remote)?;
    self.do_merge(&ref_spec, fetch_commit)?;
    Ok(())
  }

  pub fn test_git_clone_ssh() -> Result<(), git2::Error> {
    // Prepare callbacks.
    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
      debug!("username_from_url: {:?}", username_from_url);
      Cred::ssh_key_from_agent(username_from_url.unwrap())
    });

    // Prepare fetch options.
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(callbacks);

    // Prepare builder.
    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(fo);

    // Clone the project.
    builder.clone(
      "git@github.com:rust-lang/git2-rs.git",
      Path::new("/tmp/git2-rs"),
    )?;
    Ok(())
  }
}

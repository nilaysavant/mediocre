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

  /// # Fetch a repo
  ///
  /// Downloads data from remote repo and updates existing files.
  pub fn fetch(&self) -> Result<()> {
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(Self::create_callbacks());
    let ref_spec = Self::get_ref_specs("master");
    self
      .repository
      .find_remote("origin")?
      .fetch(&[ref_spec], Some(&mut fo), None)?;
    Ok(())
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

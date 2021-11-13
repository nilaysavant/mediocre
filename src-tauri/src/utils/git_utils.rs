use std::path::{Path, PathBuf};

use anyhow::Result;
use git2::{Cred, IndexAddOption, RemoteCallbacks, Repository};
use log::debug;

/// # Utilities for interacting with git
/// Wrapper on top of `git2` library
pub struct GitUtils {
  repository: Repository,
}

impl GitUtils {
  /// # Create a new GitUtils instance
  /// - Creates an instance of the git repository at
  /// the `remote_url` and clones to the `clone_path` specified.
  pub fn new(remote_url: String, clone_path: &Path) -> Result<Self> {
    let repository = Self::clone(remote_url, clone_path)?;
    Ok(Self { repository })
  }

  /// # Clone a repo
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
  /// Downloads data from remote repo and updates existing files.
  pub fn fetch(self) -> Result<()> {
    self
      .repository
      .find_remote("origin")?
      .fetch(&["master"], None, None)?;
    Ok(())
  }

  /// # Add files to track
  /// Add all files to track under the specified `dir_path`.
  pub fn add(self, dir_path: &Path) -> Result<()> {
    let mut index = self.repository.index()?;
    index.add_all([dir_path].iter(), IndexAddOption::DEFAULT, None)?;
    index.write()?;
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

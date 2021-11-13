use std::{env, error::Error, path::Path};

use anyhow::Result;
use git2::{Cred, RemoteCallbacks};
use log::debug;
use pickledb::PickleDb;

use super::app_state::AppState;

/// For syncing files/configs to cloud
#[derive(Debug, Clone)]
pub struct CloudSync {
  git_sync_repo_url: String,
}

impl CloudSync {
  /// # Create a new `CloudSync` instance
  /// - Using the given `git_sync_repo_url`.
  /// - Also sets the url in the `DB` and `state`.
  pub fn new(state: AppState, db: &mut PickleDb, git_sync_repo_url: String) -> Result<Self> {
    db.set("git_sync_repo_url", &git_sync_repo_url)?; // Set the url in the DB
    let mut state_git_sync_repo_url = state
      .git_sync_repo_url
      .lock()
      .map_err(|e| anyhow::Error::msg(e.to_string()))?;
    *state_git_sync_repo_url = git_sync_repo_url.clone(); // set the url in state
    Ok(CloudSync { git_sync_repo_url })
  }

  /// Create a new `CloudSync` instance
  /// using the available data in State/DB.
  pub fn from_avail(state: AppState, db: &mut PickleDb) -> Result<Self> {
    match state.git_sync_repo_url.lock() {
      Ok(git_sync_repo_url) => Ok(CloudSync {
        git_sync_repo_url: git_sync_repo_url.to_string(),
      }),
      Err(e) => {
        let git_sync_repo_url = db.get("git_sync_repo_url").ok_or(anyhow::Error::msg(
          "could not get `git_sync_repo_url` from db.",
        ))?;
        Ok(CloudSync { git_sync_repo_url })
      }
    }
  }

  /// Pull the changes from the remote url
  pub fn pull_changes(self, state: AppState, db: &mut PickleDb) -> Result<()> {
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

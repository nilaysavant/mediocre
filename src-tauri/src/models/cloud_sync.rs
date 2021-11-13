use std::{env, error::Error, path::Path};

use anyhow::Result;
use git2::{Cred, RemoteCallbacks};
use log::debug;
use pickledb::PickleDb;

/// For syncing files/configs to cloud
#[derive(Debug, Clone)]
pub struct CloudSync {
  git_sync_repo_url: String,
}

impl CloudSync {
  /// Create a new `CloudSync` instance from the
  /// given `git_sync_repo_url`.
  pub fn new(db: &mut PickleDb, git_sync_repo_url: String) -> Result<Self> {
    db.set("git_sync_repo_url", &git_sync_repo_url)?;
    Ok(CloudSync { git_sync_repo_url })
  }

  /// Create a new `CloudSync` instance
  /// with required data from DB.
  pub fn from_db(db: &mut PickleDb) -> Result<Self> {
    let git_sync_repo_url = db.get("git_sync_repo_url").ok_or(anyhow::Error::msg(
      "could not get `git_sync_repo_url` from db.",
    ))?;
    Ok(CloudSync { git_sync_repo_url })
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

/*
let mut db = db_state.db.lock().map_err(|e| e.to_string())?;
  db.set("git_sync_repo_url", &git_sync_repo_url)
    .map_err(|e| e.to_string())?;
  let mut state_git_sync_repo_url = state.git_sync_repo_url.lock().map_err(|e| e.to_string())?;
  *state_git_sync_repo_url = git_sync_repo_url;
  Ok(StoreGitRepositoryUrlResponse {
    status: true,
    message: "Success".to_string(),
  })
 */

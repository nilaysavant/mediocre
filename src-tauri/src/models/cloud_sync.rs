use std::path::Path;

use anyhow::Result;
use chrono::{SecondsFormat, Utc};
use git2::{Cred, RemoteCallbacks};
use log::debug;
use pickledb::PickleDb;
use serde::Serialize;

use crate::utils::{
  git_utils::GitUtils,
  window_event_manager::{WindowEvent, WindowEventManager, WindowEventType},
};

use super::{app_dir_paths, app_state::AppState};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CloudSyncPayload {
  pub message: &'static str,
}

/// For syncing files/configs to cloud
pub struct CloudSync<'weml> {
  git_sync_repo_url: String,
  wem: &'weml WindowEventManager<'weml>,
}

impl<'cs> CloudSync<'cs> {
  /// # Create a new `CloudSync` instance
  /// - Using the given `git_sync_repo_url`.
  /// - Also sets the url in the `DB` and `state`.
  pub fn new(
    state: AppState,
    db: &mut PickleDb,
    wem: &'cs WindowEventManager,
    git_sync_repo_url: String,
  ) -> Result<Self> {
    db.set("git_sync_repo_url", &git_sync_repo_url)?; // Set the url in the DB
    let mut state_git_sync_repo_url = state
      .git_sync_repo_url
      .lock()
      .map_err(|e| anyhow::Error::msg(e.to_string()))?;
    *state_git_sync_repo_url = git_sync_repo_url.clone(); // set the url in state
    Ok(CloudSync {
      git_sync_repo_url,
      wem,
    })
  }

  /// Create a new `CloudSync` instance
  /// using the available data in State/DB.
  pub fn from_avail(
    state: AppState,
    db: &mut PickleDb,
    wem: &'cs WindowEventManager,
  ) -> Result<Self> {
    match state.git_sync_repo_url.lock() {
      Ok(git_sync_repo_url) => Ok(CloudSync {
        git_sync_repo_url: git_sync_repo_url.to_string(),
        wem,
      }),
      Err(e) => {
        let git_sync_repo_url = db.get("git_sync_repo_url").ok_or(anyhow::Error::msg(
          "could not get `git_sync_repo_url` from db.",
        ))?;
        Ok(CloudSync {
          git_sync_repo_url,
          wem,
        })
      }
    }
  }

  /// Setup Sync
  pub fn setup(self, state: AppState, db: &mut PickleDb) -> Result<()> {
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Creating new repository...",
      },
    })?;
    let git_utils = GitUtils::new(self.git_sync_repo_url, &state.dir_paths.root)?;
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Pulling new repository...",
      },
    })?;
    git_utils.pull()?; // Pull the repo
    let mut dirs = vec![];
    // Get relative path as only relative paths to repo root are supported
    let document_relative_path = state
      .dir_paths
      .documents
      .strip_prefix(state.dir_paths.root)?;
    dirs.push(document_relative_path); // add documents dir to be tracked
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Adding Commits...",
      },
    })?;
    git_utils.add_commit(
      // Commit changes
      dirs,
      format!(
        "Commit Changes, time: {}",
        Utc::now().to_rfc3339_opts(SecondsFormat::Millis, true)
      )
      .as_str(),
    )?;
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Pushing changes to remote...",
      },
    })?;
    git_utils.push()?; // Push Changes to remote
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

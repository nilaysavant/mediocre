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

use super::app_state::AppState;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CloudSyncPayload {
  pub message: &'static str,
}

/// For syncing files/configs to cloud
pub struct CloudSync<'weml> {
  wem: &'weml WindowEventManager<'weml>,
}

impl<'cs> CloudSync<'cs> {
  /// # New `CloudSync`
  /// Create a new `CloudSync` instance
  ///
  /// - Using the given `git_sync_repo_url`.
  /// - Also sets the url in the `DB` and `state`.
  pub fn new(state: AppState, db: &mut PickleDb, wem: &'cs WindowEventManager) -> Result<Self> {
    Ok(CloudSync { wem })
  }

  /// # Setup
  ///
  /// Setup sync with git remote
  pub fn setup(
    self,
    mut state: AppState,
    db: &mut PickleDb,
    git_sync_repo_url: &str,
    git_sync_user_name: &str,
    git_sync_user_email: &str,
  ) -> Result<()> {
    self.wem.send(WindowEvent {
      name: "setup_cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Creating new repository...",
      },
    })?;
    *state
      .cloud_sync_is_syncing
      .lock()
      .map_err(|e| anyhow::anyhow!(e.to_string()))? = true;
    let git_utils = GitUtils::new(
      &git_sync_repo_url,
      &state.dir_paths.root,
      &git_sync_user_name,
      &git_sync_user_email,
    )?;
    self.wem.send(WindowEvent {
      name: "setup_cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Pulling changes...",
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
      name: "setup_cloud_sync",
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
      name: "setup_cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Pushing changes to remote...",
      },
    })?;
    git_utils.push()?; // Push Changes to remote
    *state
      .cloud_sync_is_syncing
      .lock()
      .map_err(|e| anyhow::anyhow!(e.to_string()))? = false;
    self.wem.send(WindowEvent {
      name: "setup_cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Success!",
      },
    })?;
    Ok(())
  }

  /// # Sync
  ///
  /// Normal Sync to git remote
  pub fn sync(self, mut state: AppState, db: &mut PickleDb) -> Result<()> {
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Creating new repository...",
      },
    })?;
    *state
      .cloud_sync_is_syncing
      .lock()
      .map_err(|e| anyhow::anyhow!(e.to_string()))? = true;
    let git_utils = GitUtils::load(&state.dir_paths.root)?;
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Pulling changes...",
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
    *state
      .cloud_sync_is_syncing
      .lock()
      .map_err(|e| anyhow::anyhow!(e.to_string()))? = false;
    self.wem.send(WindowEvent {
      name: "cloud_sync",
      typ: WindowEventType::INFO,
      data: CloudSyncPayload {
        message: "Success!",
      },
    })?;
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

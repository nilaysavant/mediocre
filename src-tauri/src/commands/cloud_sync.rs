use log::info;
use serde::{Deserialize, Serialize};

use crate::{
  commands::fs,
  models::{
    app_db_state::AppDbState,
    app_state::AppState,
    cloud_sync::{self, CloudSync},
  },
  utils::window_event_manager::{WindowEvent, WindowEventManager, WindowEventType},
};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TestGitCloneSshResponse {
  status: bool,
  message: String,
}

/// Command to Test Git clone via ssh
#[tauri::command]
pub async fn test_git_clone_ssh(
  state: tauri::State<'_, AppState>,
  db_state: tauri::State<'_, AppDbState>,
) -> Result<TestGitCloneSshResponse, String> {
  info!("Testing git clone via ssh...");
  std::fs::remove_dir_all("/tmp/git2-rs").ok();
  CloudSync::test_git_clone_ssh().map_err(|e| e.to_string())?;
  info!("Done!");
  Ok(TestGitCloneSshResponse {
    status: true,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetupGitCloudSyncResponse {
  status: bool,
  message: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetupGitCloudSyncPayload {
  message: &'static str,
}

/// # Command to setup Git Cloud Sync
///
/// - Get the repo url, set it in DB + State.
/// - Clone/Pull the repo in the `app_dir`.
/// - Add the required files/dir to sync.
/// - Push the changes to repo origin.
#[tauri::command]
pub async fn setup_git_cloud_sync(
  state: tauri::State<'_, AppState>,
  db_state: tauri::State<'_, AppDbState>,
  window: tauri::Window,
  git_sync_repo_url: String,
) -> Result<SetupGitCloudSyncResponse, String> {
  let mut db = db_state.db.lock().map_err(|e| e.to_string())?;
  let cloud_sync = CloudSync::new(state.inner().to_owned(), &mut db, git_sync_repo_url)
    .map_err(|e| e.to_string())?;
  let mut wem = WindowEventManager::new(window);
  wem
    .send(WindowEvent {
      name: "setup_git_cloud_sync",
      typ: WindowEventType::INFO,
      data: SetupGitCloudSyncPayload {
        message: "Starting sync, Please wait...",
      },
    })
    .map_err(|e| e.to_string())?;
  cloud_sync
    .setup(state.inner().to_owned(), &mut db)
    .map_err(|e| e.to_string())?;
  Ok(SetupGitCloudSyncResponse {
    status: true,
    message: "Success".to_string(),
  })
}

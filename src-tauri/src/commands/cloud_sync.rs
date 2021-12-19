use log::info;
use serde::{Deserialize, Serialize};

use crate::{
  models::{app_db_state::AppDbState, app_state::AppState, cloud_sync::CloudSync},
  utils::{
    error::error_to_string, sync_state_manager::check_cloud_or_fs_is_syncing,
    window_event_manager::WindowEventManager,
  },
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
  CloudSync::test_git_clone_ssh().map_err(error_to_string)?;
  info!("Done!");
  Ok(TestGitCloneSshResponse {
    status: true,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SetupGitCloudSyncResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
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
  git_sync_user_name: String,
  git_sync_user_email: String,
) -> Result<SetupGitCloudSyncResponse, String> {
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_cloud_or_fs_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(SetupGitCloudSyncResponse {
      status: false,
      retry: true,
      message: "Sync is already in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(SetupGitCloudSyncResponse {
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let mut db = db_state.db.lock().map_err(error_to_string)?;
  let wem = WindowEventManager::new(&window);
  let cloud_sync =
    CloudSync::new(state.inner().to_owned(), &mut db, &wem).map_err(error_to_string)?;
  cloud_sync
    .setup(
      state.inner().to_owned(),
      &mut db,
      &git_sync_repo_url,
      &git_sync_user_name,
      &git_sync_user_email,
    )
    .map_err(error_to_string)?;
  Ok(SetupGitCloudSyncResponse {
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SyncToGitCloudResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// # Sync to Git Cloud
///
/// Command to Sync documents to Git Cloud
///
#[tauri::command]
pub async fn sync_to_git_cloud(
  state: tauri::State<'_, AppState>,
  db_state: tauri::State<'_, AppDbState>,
  window: tauri::Window,
) -> Result<SyncToGitCloudResponse, String> {
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_cloud_or_fs_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(SyncToGitCloudResponse {
      status: false,
      retry: true,
      message: "Sync is already in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(SyncToGitCloudResponse {
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let mut db = db_state.db.lock().map_err(error_to_string)?;
  let wem = WindowEventManager::new(&window);
  let cloud_sync =
    CloudSync::new(state.inner().to_owned(), &mut db, &wem).map_err(error_to_string)?;
  cloud_sync
    .sync(state.inner().to_owned(), &mut db)
    .map_err(error_to_string)?;
  Ok(SyncToGitCloudResponse {
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

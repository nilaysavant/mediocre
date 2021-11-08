use log::info;
use serde::{Deserialize, Serialize};

use crate::{
  commands::fs,
  models::{app_db_state::AppDbState, app_state::AppState, cloud_sync::CloudSync},
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
pub struct StoreGitRepositoryUrlResponse {
  status: bool,
  message: String,
}

/// Command to store the Git Sync Repo (SSH) url
#[tauri::command]
pub async fn store_git_repository_url(
  git_sync_repo_url: String,
  state: tauri::State<'_, AppState>,
  db_state: tauri::State<'_, AppDbState>,
) -> Result<StoreGitRepositoryUrlResponse, String> {
  let mut db = db_state.db.lock().map_err(|e| e.to_string())?;
  db.set("git_sync_repo_url", &git_sync_repo_url)
    .map_err(|e| e.to_string())?;
  let mut state_git_sync_repo_url = state.git_sync_repo_url.lock().map_err(|e| e.to_string())?;
  *state_git_sync_repo_url = git_sync_repo_url;
  Ok(StoreGitRepositoryUrlResponse {
    status: true,
    message: "Success".to_string(),
  })
}

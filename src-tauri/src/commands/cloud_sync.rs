use log::info;
use serde::{Deserialize, Serialize};

use crate::{commands::fs, models::{app_db_state::AppDbState, app_state::AppState, cloud_sync::CloudSync}};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TestGitCloneSshResponse {
  status: bool,
  message: String,
}

/// Command to Test Git clone via ssh
#[tauri::command]
pub fn test_git_clone_ssh(
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

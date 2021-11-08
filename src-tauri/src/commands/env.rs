use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvResponse {
  app_dir_path: Option<PathBuf>,
}

/// Get Environment Variables
#[tauri::command]
pub fn get_env() -> EnvResponse {
  let app_dir_path = tauri::api::path::app_dir(&tauri::Config::default());
  EnvResponse { app_dir_path }
}

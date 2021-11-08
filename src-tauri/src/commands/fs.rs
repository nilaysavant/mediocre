use relative_path::RelativePath;
use serde::{Deserialize, Serialize};

use crate::{models::app_state::AppState, utils::fsutils};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFileToResponse {
  status: bool,
  message: String,
}

/// Save File to Command
#[tauri::command]
pub fn save_file_to(
  save_path: String,
  file_data: String,
  state: tauri::State<'_, AppState>,
) -> Result<SaveFileToResponse, String> {
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let save_path = RelativePath::new(save_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  fsutils::write_to_path(save_path.as_path(), file_data).map_err(|e| e.to_string())?;
  Ok(SaveFileToResponse {
    status: true,
    message: "Success".to_string(),
  })
}

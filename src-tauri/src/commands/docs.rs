use log::info;
use relative_path::RelativePath;
use serde::{Deserialize, Serialize};

use crate::{
  models::app_state::AppState,
  utils::{error::error_to_string, fsutils},
};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchDocInfoResponse {
  file_meta_info: fsutils::FileMetaInfo,
}

/// Fetch Document info from document relative path (ie. relative to app root dir)
#[tauri::command]
pub async fn fetch_doc_info(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<FetchDocInfoResponse, String> {
  info!("fetch_doc_info() -> relative_path: {}", relative_path);
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  let file_meta_info =
    fsutils::get_file_meta_from_path(documents_dir, &file_path).map_err(error_to_string)?;
  Ok(FetchDocInfoResponse { file_meta_info })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchAllDocsInfoResponse {
  files_meta_info: Vec<fsutils::FileMetaInfo>,
}

/// Fetch Documents info from app root dir
#[tauri::command]
pub async fn fetch_all_docs_info(
  state: tauri::State<'_, AppState>,
) -> Result<FetchAllDocsInfoResponse, String> {
  let documents_dir = &state.dir_paths.documents;
  let files_meta_info =
    fsutils::get_all_files_meta_from_path(documents_dir.as_path()).map_err(error_to_string)?;
  Ok(FetchAllDocsInfoResponse { files_meta_info })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadDocumentResponse {
  content: String,
}

/// Read Document on the specified relative path
#[tauri::command]
pub async fn read_document(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<ReadDocumentResponse, String> {
  info!("read_document() -> relative_path: {}", relative_path);
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  let content = fsutils::read_from_path(file_path).map_err(error_to_string)?;
  Ok(ReadDocumentResponse { content })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WriteDocumentResponse {
  status: bool,
}

/// Write Document to the specified relative path
#[tauri::command]
pub async fn write_document(
  relative_path: String,
  content: String,
  state: tauri::State<'_, AppState>,
) -> Result<WriteDocumentResponse, String> {
  info!("write_document() -> relative_path: {}", relative_path);
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  fsutils::write_to_path(file_path.as_path(), content).map_err(error_to_string)?;
  Ok(WriteDocumentResponse { status: true })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveDocumentResponse {
  status: bool,
}

/// Remove/Delete Document on the specified relative path
#[tauri::command]
pub async fn remove_document(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<RemoveDocumentResponse, String> {
  info!("remove_document() -> relative_path: {}", relative_path);
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  fsutils::remove_from_path(file_path.as_path()).map_err(error_to_string)?;
  Ok(RemoveDocumentResponse { status: true })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameDocumentResponse {
  status: bool,
}

/// Rename Document on the specified relative path
#[tauri::command]
pub async fn rename_document(
  relative_path: String,
  new_document_name: String,
  state: tauri::State<'_, AppState>,
) -> Result<RenameDocumentResponse, String> {
  info!(
    "rename_document() -> relative_path: {}, new_document_name: {}",
    relative_path, new_document_name
  );
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  fsutils::rename_file(file_path.as_path(), new_document_name).map_err(error_to_string)?;
  Ok(RenameDocumentResponse { status: true })
}

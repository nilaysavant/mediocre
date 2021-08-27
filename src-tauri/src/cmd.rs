use std::path::PathBuf;

use crate::utils::fsutils;
use comrak::{markdown_to_html, ComrakOptions};
use log::info;
use relative_path::RelativePath;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
  message: String,
}

#[tauri::command]
pub fn my_custom_command(message: String) -> Response {
  println!("I was invoked from JS! Message: {}", message);
  Response { message }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MdResponse {
  markup: String,
}

/// Parse/Convert Markdown string into HTML Markup string
#[tauri::command]
pub fn parse_md_to_mu(md_string: String) -> MdResponse {
  let mut comrak_options = ComrakOptions::default();
  comrak_options.extension.autolink = true; // Auto detect links
  comrak_options.extension.table = true; // Detect tables
  comrak_options.extension.tasklist = true; // Detect Checklist
  comrak_options.extension.front_matter_delimiter = Some("---".to_owned()); // Ignore front-mater starting with '---'
  comrak_options.render.unsafe_ = true;
  comrak_options.render.hardbreaks = true;
  let unsafe_mu_string = markdown_to_html(&md_string, &comrak_options);
  let safe_mu_string = ammonia::Builder::new()
    .add_tag_attributes("code", &["class"]) // Allow class on <code> tag (needed for code syntax highlighting)
    .clean(&unsafe_mu_string)
    .to_string();
  MdResponse {
    markup: safe_mu_string,
  }
}

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

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFileToResponse {
  status: bool,
  message: String,
}

/// Save File to Command
#[tauri::command]
pub fn save_file_to(save_path: String, file_data: String) -> Result<SaveFileToResponse, String> {
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let save_path = RelativePath::new(save_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  fsutils::write_to_path(save_path.as_path(), file_data).map_err(|e| e.to_string())?;
  Ok(SaveFileToResponse {
    status: true,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchDocInfoResponse {
  file_meta_info: fsutils::FileMetaInfo,
}

/// Fetch Document info from document relative path (ie. relative to app root dir)
#[tauri::command]
pub fn fetch_doc_info(relative_path: String) -> Result<FetchDocInfoResponse, String> {
  info!("fetch_doc_info() -> relative_path: {}", relative_path);
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  let file_meta_info =
    fsutils::get_file_meta_from_path(file_path.as_path()).map_err(|e| e.to_string())?;
  Ok(FetchDocInfoResponse { file_meta_info })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchAllDocsInfoResponse {
  files_meta_info: Vec<fsutils::FileMetaInfo>,
}

/// Fetch Documents info from app root dir
#[tauri::command]
pub fn fetch_all_docs_info() -> Result<FetchAllDocsInfoResponse, String> {
  let path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  let files_meta_info =
    fsutils::get_all_files_meta_from_path(path.as_path()).map_err(|e| e.to_string())?;
  Ok(FetchAllDocsInfoResponse { files_meta_info })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadDocumentResponse {
  content: String,
}

/// Read Document on the specified relative path
#[tauri::command]
pub fn read_document(relative_path: String) -> Result<ReadDocumentResponse, String> {
  info!("read_document() -> relative_path: {}", relative_path);
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  let content = fsutils::read_from_path(file_path).map_err(|e| e.to_string())?;
  Ok(ReadDocumentResponse { content })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WriteDocumentResponse {
  status: bool,
}

/// Write Document to the specified relative path
#[tauri::command]
pub fn write_document(
  relative_path: String,
  content: String,
) -> Result<WriteDocumentResponse, String> {
  info!("write_document() -> relative_path: {}", relative_path);
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  fsutils::write_to_path(file_path.as_path(), content).map_err(|e| e.to_string())?;
  Ok(WriteDocumentResponse { status: true })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveDocumentResponse {
  status: bool,
}

/// Remove/Delete Document on the specified relative path
#[tauri::command]
pub fn remove_document(relative_path: String) -> Result<RemoveDocumentResponse, String> {
  info!("remove_document() -> relative_path: {}", relative_path);
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  fsutils::remove_from_path(file_path.as_path()).map_err(|e| e.to_string())?;
  Ok(RemoveDocumentResponse { status: true })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameDocumentResponse {
  status: bool,
}

/// Remove/Delete Document on the specified relative path
#[tauri::command]
pub fn rename_document(
  relative_path: String,
  new_file_name: String,
) -> Result<RenameDocumentResponse, String> {
  info!(
    "rename_document() -> relative_path: {}, new_file_name: {}",
    relative_path, new_file_name
  );
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(app_dir_path)
    .to_owned();
  fsutils::rename_file(file_path.as_path(), new_file_name).map_err(|e| e.to_string())?;
  Ok(RenameDocumentResponse { status: true })
}

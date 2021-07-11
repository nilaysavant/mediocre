use std::path::{Path, PathBuf};

use crate::utils::fsutils;
use comrak::{markdown_to_html, ComrakOptions};
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
  let save_path = Path::new(save_path.as_str());
  fsutils::write_to_path(save_path, file_data).map_err(|e| e.to_string())?;
  Ok(SaveFileToResponse {
    status: true,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchDocsInfoResponse {
  files_meta_info: Vec<fsutils::FileMetaInfo>,
}

/// Fetch Documents info from app root dir
#[tauri::command]
pub fn fetch_docs_info() -> Result<FetchDocsInfoResponse, String> {
  let path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  let files_meta_info =
    fsutils::get_files_meta_from_path(path.as_path()).map_err(|e| e.to_string())?;
  Ok(FetchDocsInfoResponse { files_meta_info })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadDocumentResponse {
  content: String,
}

/// Read Document on the specified relative path
#[tauri::command]
pub fn read_document(relative_path: String) -> Result<ReadDocumentResponse, String> {
  let app_dir_path = fsutils::get_app_root_dir_path().map_err(|e| e.to_string())?;
  let file_path = app_dir_path.join(relative_path);
  let content = fsutils::read_from_path(file_path).map_err(|e| e.to_string())?;
  Ok(ReadDocumentResponse { content })
}

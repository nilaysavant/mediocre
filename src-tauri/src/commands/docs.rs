use log::{debug, info};
use relative_path::RelativePath;
use serde::{Deserialize, Serialize};

use crate::{
  models::app_state::AppState,
  utils::{error::error_to_string, fsutils, sync_state_manager::check_fs_or_cloud_is_syncing},
};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchDocInfoResponse {
  file_meta_info: Option<fsutils::FileMetaInfo>,
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// Fetch Document info from document relative path (ie. relative to app root dir)
#[tauri::command]
pub async fn fetch_doc_info(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<FetchDocInfoResponse, String> {
  info!("fetch_doc_info() -> relative_path: {}", relative_path);
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(FetchDocInfoResponse {
      file_meta_info: None,
      status: false,
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(FetchDocInfoResponse {
      file_meta_info: None,
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  let file_meta_info =
    fsutils::get_file_meta_from_path(documents_dir, &file_path).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(FetchDocInfoResponse {
    file_meta_info: Some(file_meta_info),
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FetchAllDocsInfoResponse {
  files_meta_info: Option<Vec<fsutils::FileMetaInfo>>,
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// Fetch Documents info from app root dir
#[tauri::command]
pub async fn fetch_all_docs_info(
  state: tauri::State<'_, AppState>,
) -> Result<FetchAllDocsInfoResponse, String> {
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(FetchAllDocsInfoResponse {
      files_meta_info: None,
      status: false,
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(FetchAllDocsInfoResponse {
      files_meta_info: None,
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  let files_meta_info =
    fsutils::get_all_files_meta_from_path(documents_dir.as_path()).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(FetchAllDocsInfoResponse {
    files_meta_info: Some(files_meta_info),
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadDocumentResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Document Response content
  content: String,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// Read Document on the specified relative path
#[tauri::command]
pub async fn read_document(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<ReadDocumentResponse, String> {
  info!("read_document() -> relative_path: {}", relative_path);
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(ReadDocumentResponse {
      status: false,
      content: "".to_string(),
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(ReadDocumentResponse {
      status: false,
      content: "".to_string(),
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  let content = fsutils::read_from_path(file_path).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(ReadDocumentResponse {
    status: true,
    content,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WriteDocumentResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// Write Document to the specified relative path
#[tauri::command]
pub async fn write_document(
  relative_path: String,
  content: String,
  state: tauri::State<'_, AppState>,
) -> Result<WriteDocumentResponse, String> {
  info!("write_document() -> relative_path: {}", relative_path);
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(WriteDocumentResponse {
      status: false,
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(WriteDocumentResponse {
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  fsutils::write_to_path(file_path.as_path(), content).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(WriteDocumentResponse {
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveDocumentResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
}

/// Remove/Delete Document on the specified relative path
#[tauri::command]
pub async fn remove_document(
  relative_path: String,
  state: tauri::State<'_, AppState>,
) -> Result<RemoveDocumentResponse, String> {
  info!("remove_document() -> relative_path: {}", relative_path);
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(RemoveDocumentResponse {
      status: false,
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(RemoveDocumentResponse {
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  fsutils::remove_from_path(file_path.as_path()).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(RemoveDocumentResponse {
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameDocumentResponse {
  /// `true` for success, `false` for failure
  status: bool,
  /// Available to Retry the API. Use this to
  /// allow multiple retries from the client.
  retry: bool,
  /// Success/Error message
  message: String,
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
  let (cloud_sync_is_syncing, fs_sync_is_syncing) =
    check_fs_or_cloud_is_syncing(state.inner().to_owned()).map_err(error_to_string)?;
  if cloud_sync_is_syncing {
    return Ok(RenameDocumentResponse {
      status: false,
      retry: true,
      message: "Cloud Sync in progress, Please re-try after some time!".to_string(),
    });
  } else if fs_sync_is_syncing {
    return Ok(RenameDocumentResponse {
      status: false,
      retry: true,
      message: "FileSystem sync in progress, Please re-try after some time!".to_string(),
    });
  }
  let documents_dir = &state.dir_paths.documents;
  // Using Relative path in an effort to achieve cross platform compatible/portable path resolution
  let file_path = RelativePath::new(relative_path.as_str())
    .normalize()
    .to_path(documents_dir)
    .to_owned();
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = true;
  fsutils::rename_file(file_path.as_path(), new_document_name).map_err(error_to_string)?;
  *state
    .inner()
    .to_owned()
    .fs_sync_is_syncing
    .lock()
    .map_err(error_to_string)? = false;
  Ok(RenameDocumentResponse {
    status: true,
    retry: false,
    message: "Success".to_string(),
  })
}

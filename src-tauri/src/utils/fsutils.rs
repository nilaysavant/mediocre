use std::{
  env,
  fs::{self, OpenOptions},
  io::Write,
  path::{Path, PathBuf},
};

use chrono::{DateTime, SecondsFormat, Utc};
use log::{error, info};
use serde::{Deserialize, Serialize};
use tauri::api::path::home_dir;
use walkdir::WalkDir;

use crate::{constants::paths::APP_DATA_DIR_NAME, models::{app_dir_paths::AppDirPaths, server_error::{map_to_server_error, ServerError}}};

pub fn get_app_root_dir_path() -> Result<PathBuf, ServerError> {
  let debug_level = env::var("RUST_DEBUG").unwrap_or("0".to_string());
  match home_dir() {
    Some(dir) => {
      let path = dir.join(APP_DATA_DIR_NAME);
      if debug_level.eq("1") {
        let mut new_path =
          path
            .into_os_string()
            .into_string()
            .map_err(|e| ServerError::InternalError {
              message: e.to_string_lossy().to_string(),
            })?;
        new_path.push_str("dev"); // append dev to app dir name
        let dev_path = Path::new(&new_path).to_path_buf();
        Ok(dev_path)
      } else {
        Ok(path)
      }
    }
    None => Err(ServerError::UserError {
      message: "Home directory unavailable!".to_string(),
    }),
  }
}

/// Create default dirs for the application config/db/documents etc files
pub fn create_app_default_dirs(app_dir_paths: &AppDirPaths) -> Result<(), ServerError> {
  fs::create_dir_all(&app_dir_paths.root).map_err(map_to_server_error)?;
  fs::create_dir_all(&app_dir_paths.db).map_err(map_to_server_error)?;
  fs::create_dir_all(&app_dir_paths.documents).map_err(map_to_server_error)?;
  Ok(())
}

/// Read document file from a path and return content as string
pub fn read_from_path<P: AsRef<Path>>(path: P) -> Result<String, ServerError> {
  let content = fs::read_to_string(path).map_err(map_to_server_error)?;
  Ok(content)
}

/// Write `json_data` to the specified file path (recursively create all parent paths)
pub fn write_to_path<P: AsRef<Path> + Copy>(path: P, file_data: String) -> Result<(), ServerError> {
  let default_path = get_app_root_dir_path()?;
  let parent_path = path.as_ref().parent().unwrap_or(default_path.as_path());
  fs::create_dir_all(parent_path).map_err(map_to_server_error)?;
  let mut f = OpenOptions::new()
    .write(true)
    .create(true)
    .truncate(true)
    .open(path.as_ref())
    .map_err(map_to_server_error)?;
  f.write_all(file_data.as_ref())
    .map_err(map_to_server_error)?;
  f.sync_all().map_err(map_to_server_error)?;
  Ok(())
}

/// Remove file from path
pub fn remove_from_path<P: AsRef<Path> + Copy>(path: P) -> Result<(), ServerError> {
  // remove only the file of specified path
  fs::remove_file(path).map_err(map_to_server_error)?;
  Ok(())
}

/// Rename file at the specified path to `new_file_name`
pub fn rename_file<P: AsRef<Path> + Copy>(
  path: P,
  new_file_name: String,
) -> Result<(), ServerError> {
  let parent_path = path.as_ref().parent().ok_or(ServerError::UserError {
    message: "parent_path invalid!".to_string(),
  })?;
  let new_path = parent_path.join(new_file_name);
  fs::rename(path, new_path).map_err(map_to_server_error)?;
  Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FileMetaInfo {
  file_name: String,
  file_path: String,
  file_relative_path: Option<String>,
  file_dir: Option<String>,
  file_type: Option<String>,
  modified: Option<String>,
}

/// Get file meta info for given file path
pub fn get_file_meta_from_path<P: AsRef<Path> + Copy>(
  path: P,
) -> Result<FileMetaInfo, ServerError> {
  // There have been discussions wrt differences in file
  // path serialization between various platforms namely win and unix
  // Currently will assume valid and serialize(able) chars are used
  // as file names and paths will be constructed using the app itself.
  // Update: Trying to use RelativePath crate to solve this
  let path_ref = path.as_ref();
  let base_path = get_app_root_dir_path()?;
  let file_name = path_ref
    .file_name()
    .ok_or_else(|| ServerError::UserError {
      message: "file_name not available!".to_string(),
    })?
    .to_string_lossy()
    .to_string();
  let file_path = path_ref.to_string_lossy().to_string();
  let file_relative_path = match path_ref.strip_prefix(base_path) {
    Ok(p) => Some(p.to_string_lossy().to_string()),
    Err(err) => {
      error!("{}", err.to_string());
      None
    }
  };

  let file_dir = match path_ref.parent() {
    Some(p) => match p.components().last() {
      Some(c) => Some(c.as_os_str().to_string_lossy().to_string()),
      None => None,
    },
    None => None,
  };
  let file_type = match path_ref.extension() {
    Some(ext) => {
      if ext.eq(Path::new("test.md").extension().unwrap()) {
        Some("markdown".to_string())
      } else {
        None
      }
    }
    None => None,
  };
  let modified = match path_ref.metadata() {
    Ok(m) => match m.modified() {
      Ok(t) => {
        let system_time: DateTime<Utc> = t.into();
        Some(system_time.to_rfc3339_opts(SecondsFormat::Millis, true))
      }
      Err(_) => None,
    },
    Err(_) => None,
  };
  Ok(FileMetaInfo {
    file_name,
    file_path,
    file_relative_path,
    file_dir,
    file_type,
    modified,
  })
}

/// Get all files meta info in the given dir path
pub fn get_all_files_meta_from_path<P: AsRef<Path> + Copy>(
  path: P,
) -> Result<Vec<FileMetaInfo>, ServerError> {
  let base_path = get_app_root_dir_path()?;
  let meta_info = WalkDir::new(path)
    .into_iter()
    .filter_map(|e| e.ok())
    .filter_map(|e| match e.metadata() {
      Ok(m) => {
        if m.is_file() {
          Some(e)
        } else {
          None
        }
      }
      Err(_) => None,
    })
    .filter_map(|e| {
      // There have been discussions wrt differences in file
      // path serialization between various platforms namely win and unix
      // Currently will assume valid and serialize(able) chars are used
      // as file names and paths will be constructed using the app itself.
      // Update: Trying to use RelativePath crate to solve this
      let file_name = e.file_name().to_string_lossy().to_string();
      let file_path = e.path().to_string_lossy().to_string();
      let file_relative_path = match e.path().strip_prefix(base_path.clone()) {
        Ok(p) => Some(p.to_string_lossy().to_string()),
        Err(_) => None,
      };
      let file_dir = match e.path().parent() {
        Some(p) => match p.components().last() {
          Some(c) => Some(c.as_os_str().to_string_lossy().to_string()),
          None => None,
        },
        None => None,
      };
      let file_type = match e.path().extension() {
        Some(ext) => {
          if ext.eq(Path::new("test.md").extension().unwrap()) {
            Some("markdown".to_string())
          } else {
            None
          }
        }
        None => None,
      };
      let modified = match e.metadata() {
        Ok(m) => match m.modified() {
          Ok(t) => {
            let system_time: DateTime<Utc> = t.into();
            Some(system_time.to_rfc3339_opts(SecondsFormat::Millis, true))
          }
          Err(_) => None,
        },
        Err(_) => None,
      };
      Some(FileMetaInfo {
        file_name,
        file_path,
        file_relative_path,
        file_dir,
        file_type,
        modified,
      })
    })
    .collect::<Vec<FileMetaInfo>>();
  Ok(meta_info)
}

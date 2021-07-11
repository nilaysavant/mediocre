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

use crate::{
  constants::paths::APP_DATA_DIR_NAME,
  models::server_error::{map_to_server_error, ServerError},
};

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

/// Create default dir for the application user files
pub fn create_app_default_dir() -> Result<(), ServerError> {
  let app_path = get_app_root_dir_path().map_err(map_to_server_error)?;
  fs::create_dir_all(app_path).map_err(map_to_server_error)?;
  Ok(())
}

/// Read json file from a path and return contents as string
pub fn read_from_path<P: AsRef<Path>>(path: P) -> Result<String, ServerError> {
  let json_string = fs::read_to_string(path).map_err(map_to_server_error)?;
  Ok(json_string)
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

/// Remove parent dir in which json file is preset from a path and return the json contents as string
pub fn remove_from_path<P: AsRef<Path> + Copy>(path: P) -> Result<String, ServerError> {
  let json_string = fs::read_to_string(path).map_err(map_to_server_error)?;
  let parent_path = path
    .as_ref()
    .parent()
    .unwrap_or(Path::new(APP_DATA_DIR_NAME));
  // read num of files + subdir present in path dir
  let num_entries_in_dir = fs::read_dir(parent_path)
    .map_err(map_to_server_error)?
    .count();
  if num_entries_in_dir <= 1 {
    // remove only if one or less files + subdirs are present in dir
    fs::remove_dir_all(parent_path).map_err(map_to_server_error)?;
  } else {
    // remove only the file of specified path
    fs::remove_file(path).map_err(map_to_server_error)?;
  }
  Ok(json_string)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileMetaInfo {
  file_name: String,
  file_path: String,
  file_dir: Option<String>,
  file_type: Option<String>,
  modified: Option<String>,
}

/// Get all files meta info for given path
pub fn get_files_meta_from_path<P: AsRef<Path> + Copy>(
  path: P,
) -> Result<Vec<FileMetaInfo>, ServerError> {
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
      let file_name = e.file_name().to_string_lossy().to_string();
      let file_path = e.path().to_string_lossy().to_string();
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
        file_dir,
        file_type,
        modified,
      })
    })
    .collect::<Vec<FileMetaInfo>>();

  Ok(meta_info)
}

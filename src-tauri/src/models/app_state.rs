use std::{
  path::PathBuf,
  sync::{Arc, Mutex},
};

use pickledb::{error::ErrorType, PickleDb, PickleDbDumpPolicy, SerializationMethod};

use super::app_dir_paths::AppDirPaths;

/// State of the Application
#[derive(Debug, Clone)]
pub struct AppState {
  /// File System Paths pointing to app specific dirs
  pub dir_paths: AppDirPaths,
}

/// Database state of the Application
/// #[derive(Clone)]
pub struct AppDbState {
  /// PickleDB instance
  pub db: Arc<Mutex<PickleDb>>,
}

impl AppDbState {
  /// Init a new db instance (ie. create/load)
  /// and return a new db state struct
  pub fn new(db_path: &PathBuf) -> Self {
    match PickleDb::load(
      db_path,
      PickleDbDumpPolicy::AutoDump,
      SerializationMethod::Json,
    ) {
      Ok(db) => AppDbState {
        db: Arc::new(Mutex::new(db)),
      },
      Err(e) => {
        match e.get_type() {
          ErrorType::Io => {
            // for io error we assume that db is not found
            // thus we create a new db instance instead
            let db = PickleDb::new(
              db_path,
              PickleDbDumpPolicy::AutoDump,
              SerializationMethod::Json,
            );
            AppDbState {
              db: Arc::new(Mutex::new(db)),
            }
          }
          ErrorType::Serialization => panic!("db serialization error!"),
        }
      }
    }
  }
}

use std::path::PathBuf;

use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};

use super::app_dir_paths::AppDirPaths;

/// State of the Application
#[derive(Debug, Clone)]
pub struct AppState {
  /// File System Paths pointing to app specific dirs
  pub dir_paths: AppDirPaths,
}

/// Database state of the Application
pub struct AppDbState {
  /// PickleDB instance
  pub db: PickleDb,
}

impl AppDbState {
  /// Init a new db instance (ie. create + load)
  /// and return a new db state struct
  pub fn new(db_path: &PathBuf) -> Self {
    // create
    PickleDb::new(
      db_path,
      PickleDbDumpPolicy::AutoDump,
      SerializationMethod::Bin,
    );
    AppDbState {
      db: PickleDb::load(
        db_path,
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Bin,
      )
      .expect("failed to load db!"),
    }
  }
}

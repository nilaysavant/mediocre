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
  /// Create a db instance
  fn create_db(&self, db_path: &PathBuf) {
    PickleDb::new(
      db_path,
      PickleDbDumpPolicy::AutoDump,
      SerializationMethod::Bin,
    );
  }
  /// Init a db instance (ie. create + load)
  pub fn init(&mut self, db_path: &PathBuf) -> Result<(), pickledb::error::Error> {
    self.create_db(db_path);
    self.db = PickleDb::load(
      db_path,
      PickleDbDumpPolicy::AutoDump,
      SerializationMethod::Bin,
    )?;
    Ok(())
  }
}

use std::{
  path::{Path, PathBuf},
  sync::{Arc, Mutex},
};

use log::info;
use pickledb::{error::ErrorType, PickleDb, PickleDbDumpPolicy, SerializationMethod};

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
    // if the db is not found we create a new db instance
    if Path::exists(&db_path) == false {
      info!("db does not exist, creating new db...");
      let db = PickleDb::new(
        db_path,
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Json,
      );
      AppDbState {
        db: Arc::new(Mutex::new(db)),
      }
    } else {
      match PickleDb::load(
        db_path,
        PickleDbDumpPolicy::AutoDump,
        SerializationMethod::Json,
      ) {
        Ok(db) => AppDbState {
          db: Arc::new(Mutex::new(db)),
        },
        Err(e) => match e.get_type() {
          ErrorType::Io => {
            panic!("db io error: {}", e)
          }
          ErrorType::Serialization => panic!("db serialization error: {}", e),
        },
      }
    }
  }
}

use std::sync::{Arc, Mutex};

use super::app_dir_paths::AppDirPaths;

/// State of the Application
#[derive(Debug, Clone)]
pub struct AppState {
  /// File System Paths pointing to app specific dirs
  pub dir_paths: AppDirPaths,
  pub cloud_sync_is_syncing: Arc<Mutex<bool>>,
  pub fs_sync_is_syncing: Arc<Mutex<bool>>,
}

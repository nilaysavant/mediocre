use std::sync::{Arc, Mutex};

use super::app_dir_paths::AppDirPaths;

/// State of the Application
#[derive(Debug, Clone)]
pub struct AppState {
  /// File System Paths pointing to app specific dirs
  pub dir_paths: AppDirPaths,
  /// Git Sync repository url
  pub git_sync_repo_url: Arc<Mutex<String>>,
}

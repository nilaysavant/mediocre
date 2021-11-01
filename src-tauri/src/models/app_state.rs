use super::app_dir_paths::AppDirPaths;

/// State of the Application
#[derive(Debug, Clone)]
pub struct AppState {
  /// File System Paths pointing to app specific dirs
  dir_paths: AppDirPaths
}

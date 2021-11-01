use std::path::PathBuf;

/// For fs paths pointing to app specific dirs
#[derive(Debug, Clone)]
pub struct AppDirPaths {
  /// Path to the root app dir.
  /// - Usually set to: `~/.mediocre`
  pub root: PathBuf,
  /// Path to the documents dir.
  /// - Usually set to: `~/.mediocre/documents`
  pub documents: PathBuf,
  /// Path to the database dir.
  /// - Usually set to: `~/.mediocre/db`
  pub db: PathBuf,
}

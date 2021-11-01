/// For fs paths pointing to app specific dirs
#[derive(Debug, Clone)]
pub struct AppDirPaths {
  /// Path to the root app data dir.
  /// - Usually set to: `~/.mediocre`
  pub data_root: String,
  /// Path to the documents dir.
  /// - Usually set to: `~/.mediocre/documents`
  pub documents: String,
  /// Path to the database dir.
  /// - Usually set to: `~/.mediocre/db`
  pub db: String,
}

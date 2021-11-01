/// For fs paths pointing to app specific dirs
#[derive(Debug, Clone)]
pub struct AppDirPaths {
  /// Path to the root app data dir.
  /// - Usually set to: `~/.mediocre`
  data_root: String,
  /// Path to the documents dir.
  /// - Usually set to: `~/.mediocre/documents`
  documents: String,
  /// Path to the database dir.
  /// - Usually set to: `~/.mediocre/db`
  db: String,
}

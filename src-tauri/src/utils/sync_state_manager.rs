use anyhow::{Context, Result};

use crate::models::app_state::AppState;

/// Check if File System or Cloud sync is in progress
pub fn check_cloud_or_fs_is_syncing(state: AppState) -> anyhow::Result<(bool, bool)> {
  let cloud_sync_is_syncing = state
    .cloud_sync_is_syncing
    .lock()
    .map_err(|e| anyhow::anyhow!("{}", e.to_string()))
    .context("check_fs_or_cloud_is_syncing error")?;
  let fs_sync_is_syncing = state
    .fs_sync_is_syncing
    .lock()
    .map_err(|e| anyhow::anyhow!("{}", e.to_string()))
    .context("check_fs_or_cloud_is_syncing error")?;
  let sync_state = (*cloud_sync_is_syncing, *fs_sync_is_syncing);
  Ok(sync_state)
}

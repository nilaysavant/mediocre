use log::debug;
use serde::{Deserialize, Serialize};

use crate::models::{app_db_state::AppDbState, app_state::AppState, cloud_sync::CloudSync};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
  message: String,
}

#[tauri::command]
pub fn my_custom_command(
  message: String,
  state: tauri::State<'_, AppState>,
  db_state: tauri::State<'_, AppDbState>,
) -> Response {
  debug!("I was invoked from JS! Message: {}", message);
  debug!("State: {:?}", state.dir_paths);
  let mut db = db_state.db.lock().unwrap();
  if message.len() > 0 {
    db.set("message", &message).unwrap();
  }
  debug!("Database: {:?}", db.get::<String>("message").unwrap());
  debug!("Git clone ssh...");
  CloudSync::test_git_clone_ssh();
  debug!("Git clone ssh: Done!");
  Response { message }
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Response {
  message: String,
}

#[tauri::command]
pub fn my_custom_command(invoke_message: String) -> Response {
  println!("I was invoked from JS! Message: {}", invoke_message);
  Response {
    message: invoke_message,
  }
}

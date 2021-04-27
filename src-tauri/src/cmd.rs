use comrak::{markdown_to_html, ComrakOptions};
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

#[derive(Debug, Deserialize, Serialize)]
pub struct MdResponse {
  markup: String,
}

/// Parse/Convert Markdown string into HTML Markup string
#[tauri::command]
pub fn parse_md_to_mu(md_string: String) -> MdResponse {
  println!("md_string: {:?}", md_string);
  let mu_string = markdown_to_html(&md_string, &ComrakOptions::default());
  MdResponse { markup: mu_string }
}

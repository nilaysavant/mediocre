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
  let mut comrak_options = ComrakOptions::default();
  comrak_options.extension.autolink = true; // Auto detect links
  comrak_options.extension.table = true; // Detect tables
  comrak_options.extension.tasklist = true; // Detect Checklist
  comrak_options.extension.front_matter_delimiter = Some("---".to_owned()); // Ignore front-mater starting with '---'
  let mu_string = markdown_to_html(&md_string, &comrak_options);
  MdResponse { markup: mu_string }
}

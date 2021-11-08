use comrak::{markdown_to_html, ComrakOptions};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MdResponse {
  markup: String,
}

/// Parse/Convert Markdown string into HTML Markup string
#[tauri::command]
pub async fn parse_md_to_mu(md_string: String) -> MdResponse {
  let mut comrak_options = ComrakOptions::default();
  comrak_options.extension.autolink = true; // Auto detect links
  comrak_options.extension.table = true; // Detect tables
  comrak_options.extension.tasklist = true; // Detect Checklist
  comrak_options.extension.front_matter_delimiter = Some("---".to_owned()); // Ignore front-mater starting with '---'
  comrak_options.render.unsafe_ = true;
  comrak_options.render.hardbreaks = true;
  let unsafe_mu_string = markdown_to_html(&md_string, &comrak_options);
  let safe_mu_string = ammonia::Builder::new()
    .add_tag_attributes("code", &["class"]) // Allow class on <code> tag (needed for code syntax highlighting)
    .clean(&unsafe_mu_string)
    .to_string();
  MdResponse {
    markup: safe_mu_string,
  }
}

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use log::{error, info};

mod cmd;
mod constants;
mod models;
mod utils;

fn main() {
  let cargo_pkg_name = env!("CARGO_PKG_NAME").replace("-", "_");
  std::env::set_var(
    "RUST_LOG",
    format!("{}=debug", cargo_pkg_name), // Set the current crate(pkg) to debug mode, others to info
  );
  env_logger::init(); // init logger
  info!("Starting Mediocre...");

  // Setup
  match utils::fsutils::create_app_default_dir() {
    Ok(_) => info!("create app default dir success!"),
    Err(e) => error!("failed to create default app dir: {}", e),
  }

  // Start Tauri
  tauri::Builder::default()
    // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![
      cmd::my_custom_command,
      cmd::parse_md_to_mu,
      cmd::get_env,
      cmd::save_file_to,
      cmd::fetch_doc_info,
      cmd::fetch_all_docs_info,
      cmd::read_document,
      cmd::write_document,
      cmd::remove_document,
      cmd::rename_document
    ])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

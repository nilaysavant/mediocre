#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::process::exit;

use log::{error, info};

use crate::{models::{app_db_state::AppDbState, app_dir_paths::AppDirPaths, app_state::AppState}, utils::fsutils::get_app_root_dir_path};

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

  // assign app root dir path
  let app_root_dir_path = get_app_root_dir_path().expect("get_app_root_dir_path failed");
  // Set all the required application paths based on the root dir path
  let app_dir_paths = AppDirPaths {
    root: app_root_dir_path.clone(),
    documents: app_root_dir_path.join("documents"),
    db: app_root_dir_path.join("db"),
  };

  // Setup
  match utils::fsutils::create_app_default_dirs(&app_dir_paths) {
    Ok(_) => info!("create app default dirs success!"),
    Err(e) => {
      error!("failed to create default app dir: {}", e);
      exit(0)
    }
  }

  // Start Tauri
  tauri::Builder::default()
    .manage(AppState {
      dir_paths: app_dir_paths.clone(),
    })
    .manage(AppDbState::new(&app_dir_paths.db.join("store.db.json")))
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

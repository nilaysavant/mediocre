#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{process::exit, sync::{Arc, Mutex}};

use log::{error, info};

use crate::{
  constants::paths::{APP_DB_DIR_NAME, APP_DB_FILE_NAME, APP_LOGS_DIR_NAME, USER_DOCS_DIR_NAME},
  models::{app_db_state::AppDbState, app_dir_paths::AppDirPaths, app_state::AppState},
  utils::{fsutils::get_app_root_dir_path, logger::MediocreLogger},
};

mod commands;
mod constants;
mod models;
mod utils;

fn main() {
  let cargo_pkg_name = env!("CARGO_PKG_NAME").replace("-", "_");
  std::env::set_var(
    "RUST_LOG",
    format!("{}=debug", cargo_pkg_name), // Set the current crate(pkg) to debug mode, others to info
  );

  info!("Starting Mediocre...");

  // assign app root dir path
  let app_root_dir_path = get_app_root_dir_path().expect("get_app_root_dir_path failed");
  // Set all the required application paths based on the root dir path
  let app_dir_paths = AppDirPaths {
    root: app_root_dir_path.clone(),
    documents: app_root_dir_path.join(USER_DOCS_DIR_NAME),
    db: app_root_dir_path.join(APP_DB_DIR_NAME),
    logs: app_root_dir_path.join(APP_LOGS_DIR_NAME),
  };

  // Setup
  match utils::fsutils::create_app_default_dirs(&app_dir_paths) {
    Ok(_) => info!("create app default dirs success!"),
    Err(e) => {
      error!("failed to create default app dir: {}", e);
      exit(0)
    }
  }

  // Init logger
  MediocreLogger::init(&app_dir_paths.logs.join("app.log")).expect("failed to init logger!");

  // Start Tauri
  info!("Starting Tauri backend...");
  tauri::Builder::default()
    .manage(AppState {
      dir_paths: app_dir_paths.clone(),
      cloud_sync_is_syncing: Arc::new(Mutex::new(false)),
      fs_sync_is_syncing: Arc::new(Mutex::new(false)),
    })
    .manage(AppDbState::new(&app_dir_paths.db.join(APP_DB_FILE_NAME)))
    // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![
      commands::test_commands::my_custom_command,
      commands::md_parser::parse_md_to_mu,
      commands::env::get_env,
      commands::fs::save_file_to,
      commands::docs::fetch_doc_info,
      commands::docs::fetch_all_docs_info,
      commands::docs::read_document,
      commands::docs::write_document,
      commands::docs::remove_document,
      commands::docs::rename_document,
      commands::cloud_sync::test_git_clone_ssh,
      commands::cloud_sync::setup_git_cloud_sync,
      commands::cloud_sync::sync_to_git_cloud,
    ])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

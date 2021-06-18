#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

fn main() {
  tauri::Builder::default()
    // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![
      cmd::my_custom_command,
      cmd::parse_md_to_mu,
      cmd::get_env
    ])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

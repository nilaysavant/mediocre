use std::{env, path::Path};

use git2::{Cred, RemoteCallbacks};

/// For syncing files/configs to cloud
#[derive(Debug, Clone)]
pub struct CloudSync {}

impl CloudSync {
  pub fn test_git_clone_ssh() {
    // Prepare callbacks.
    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username_from_url, _allowed_types| {
      println!("username_from_url: {:?}", username_from_url);
      Cred::ssh_key_from_agent(username_from_url.unwrap())
    });

    // Prepare fetch options.
    let mut fo = git2::FetchOptions::new();
    fo.remote_callbacks(callbacks);

    // Prepare builder.
    let mut builder = git2::build::RepoBuilder::new();
    builder.fetch_options(fo);

    // Clone the project.
    builder
      .clone(
        "git@github.com:rust-lang/git2-rs.git",
        Path::new("/tmp/git2-rs"),
      )
      .unwrap();
  }
}

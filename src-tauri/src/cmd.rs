use std::path::PathBuf;

use crate::{
  models::{app_db_state::AppDbState, app_state::AppState, cloud_sync::CloudSync},
  utils::fsutils,
};
use comrak::{markdown_to_html, ComrakOptions};
use log::{debug, info};
use relative_path::RelativePath;
use serde::{Deserialize, Serialize};


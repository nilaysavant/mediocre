use std::fmt::Debug;

use serde::{Deserialize, Serialize};

/// # Window Event Manager
///
/// For creating and firing `tauri::Window` events.
///
/// - Used for backend -> front-end events.
/// - Sends a `payload` to the front-end.
///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowEventManager<Payload = String>
where
  Payload: Debug + Clone + Serialize,
{
  event_name: String,
  payload: Payload,
  event_type: WindowEventType,
}

/// # Type of Event
///
/// `DEBUG`, `INFO` or `ERROR`
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event_type")]
pub enum WindowEventType {
  DEBUG,
  INFO,
  ERROR,
}

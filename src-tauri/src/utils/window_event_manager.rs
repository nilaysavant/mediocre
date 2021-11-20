use std::fmt::Debug;

use anyhow::Result;
use serde::{Deserialize, Serialize};

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

/// # Window Event
///
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowEvent<P>
where
  P: Debug + Clone + Serialize,
{
  pub event_name: &'static str,
  pub payload: P,
  pub event_type: WindowEventType,
}

impl<P: Debug + Clone + Serialize> WindowEvent<P> {
  pub fn new(event_name: &'static str, payload: P, event_type: WindowEventType) -> Self {
    Self {
      event_name,
      payload,
      event_type,
    }
  }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowEventManagerPayload<P>
where
  P: Debug + Clone + Serialize,
{
  payload: P,
  event_type: WindowEventType,
}

/// # Window Event Manager
///
/// For creating and firing `tauri::Window` events.
///
/// - Used for backend -> front-end events.
/// - Sends a `payload` to the front-end.
///
#[derive(Clone)]
pub struct WindowEventManager {
  pub window: tauri::Window,
}

impl WindowEventManager {
  pub fn new(window: tauri::Window) -> Self {
    Self { window }
  }

  pub fn send<P: Debug + Clone + Serialize>(&mut self, event: WindowEvent<P>) -> Result<()> {
    self
      .window
      .emit(
        event.event_name,
        WindowEventManagerPayload {
          event_type: event.event_type,
          payload: event.payload,
        },
      )
      .map_err(|e| anyhow::anyhow!(e.to_string()))?;
    Ok(())
  }
}

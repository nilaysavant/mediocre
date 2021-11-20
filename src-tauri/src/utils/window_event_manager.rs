use std::fmt::Debug;

use anyhow::Result;
use serde::{Deserialize, Serialize};

/// # Type of Event
///
/// `DEBUG`, `INFO` or `ERROR`
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WindowEventType {
  DEBUG,
  INFO,
  ERROR,
}

/// # Window Event
///
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowEvent<D>
where
  D: Debug + Clone + Serialize,
{
  pub name: &'static str,
  pub data: D,
  pub typ: WindowEventType,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowEventManagerPayload<D>
where
  D: Debug + Clone + Serialize,
{
  typ: WindowEventType,
  data: D,
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
        event.name,
        WindowEventManagerPayload {
          typ: event.typ,
          data: event.data,
        },
      )
      .map_err(|e| anyhow::anyhow!(e.to_string()))?;
    Ok(())
  }
}

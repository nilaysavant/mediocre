use std::fmt::{Debug, Display};

use log::error;

/// # Error to String
///
/// Wraps `error.to_string()` with additional logging etc.
pub fn error_to_string<E: Debug + Display>(error: E) -> String {
  error!("{:?}", error);
  error.to_string()
}

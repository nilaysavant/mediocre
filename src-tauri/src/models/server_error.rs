use std::error::Error;

use derive_more::{Display, Error};

#[derive(Debug, Display, Error)]
pub enum ServerError {
  #[display(fmt = "{}", message)]
  UserError { message: String },
  #[display(fmt = "{}", message)]
  InternalError { message: String },
}
impl ServerError {
  /// Get `name` of the error or `type` of error
  fn name(&self) -> String {
    match self {
      ServerError::InternalError { message: _ } => "InternalError".to_string(),
      ServerError::UserError { message: _ } => "UserError".to_string(),
    }
  }
  /// Get Error Message
  fn message(&self) -> String {
    match self {
      ServerError::InternalError { message } => message.to_string(),
      ServerError::UserError { message } => message.to_string(),
    }
  }
}

pub fn map_to_server_error<T: Error>(e: T) -> ServerError {
  ServerError::InternalError {
    message: e.to_string(),
  }
}

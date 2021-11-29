use std::path::Path;

use anyhow::Result;
use log::LevelFilter;
use log4rs::{
  append::{
    console::ConsoleAppender,
    file::FileAppender,
    rolling_file::{
      policy::{
        compound::{
          roll::{delete::DeleteRoller, Roll},
          trigger::{size::SizeTrigger, Trigger},
          CompoundPolicy, CompoundPolicyConfig,
        },
        Policy,
      },
      RollingFileAppender,
    },
  },
  config::{Appender, Logger, Root},
  encode::pattern::PatternEncoder,
  Handle,
};

/// # Application logger module/utility
///
/// Currently uses `log4rs`
pub struct MediocreLogger {}

impl MediocreLogger {
  pub fn init(log_file_location: &Path) -> Result<Handle> {
    let cargo_pkg_name = env!("CARGO_PKG_NAME").replace("-", "_");
    let stdout = ConsoleAppender::builder()
      .encoder(Box::new(PatternEncoder::new(
        "[{d(%Y-%m-%dT%H:%M:%SZ)(utc)} {h({l})}] {m}{n}",
      )))
      .build();
    let log_file = RollingFileAppender::builder()
      .encoder(Box::new(PatternEncoder::new(
        "[{d(%Y-%m-%dT%H:%M:%SZ)(utc)} {h({l})}] {m}{n}",
      )))
      .build(
        log_file_location,
        Box::new(CompoundPolicy::new(
          Box::new(SizeTrigger::new(10000000)), // 10 Mb (size in bytes)
          Box::new(DeleteRoller::new()),
        )),
      )?;
    let config = log4rs::Config::builder()
      .appender(Appender::builder().build("stdout", Box::new(stdout)))
      .appender(Appender::builder().build("log_file", Box::new(log_file)))
      // Set max error level for our Application and set other crates(used) to a lower level
      .logger(Logger::builder().build(cargo_pkg_name, LevelFilter::max()))
      .build(
        Root::builder()
          .appender("stdout")
          .appender("log_file")
          // lower logging for all other crates : ref: https://github.com/estk/log4rs/issues/36#issuecomment-267836976
          .build(LevelFilter::Warn),
      )?;
    // use handle to change logger configuration at runtime
    let handle = log4rs::init_config(config)?;
    Ok(handle)
  }
}

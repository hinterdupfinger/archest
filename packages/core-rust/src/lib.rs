#![deny(clippy::all)]

use napi_derive::napi;

pub mod parser;
pub mod scanner;
pub mod rules;

use parser::ProjectData;
use rules::RuleResult;

#[napi(object)]
pub struct NapiRuleResult {
  pub pass: bool,
  pub message: String,
}

impl From<RuleResult> for NapiRuleResult {
  fn from(res: RuleResult) -> Self {
    Self {
      pass: res.pass,
      message: res.message,
    }
  }
}

#[napi]
pub struct ArchestProject {
  project_data: ProjectData,
}

#[napi]
impl ArchestProject {
  #[napi(factory)]
  pub fn parse(files: Vec<String>) -> Self {
    let paths: Vec<std::path::PathBuf> = files.into_iter().map(std::path::PathBuf::from).collect();
    let project_data = parser::parse_files(paths);
    Self { project_data }
  }

  #[napi(factory)]
  pub fn parse_mock(project_data_json: String) -> Self {
    let project_data: ProjectData = serde_json::from_str(&project_data_json).unwrap_or_default();
    Self { project_data }
  }

  #[napi]
  pub fn get_project_data(&self) -> String {
    serde_json::to_string(&self.project_data).unwrap_or_default()
  }

  #[napi]
  pub fn check_file_cycles(&self, locator_files: Vec<String>, is_not: bool) -> NapiRuleResult {
    rules::files::check_be_free_of_cycles(&self.project_data, &locator_files, is_not).into()
  }
}

// Keep legacy for now until migration completes
#[napi]
pub fn parse_project_rust(files: Vec<String>) -> String {
  let paths: Vec<std::path::PathBuf> = files.into_iter().map(std::path::PathBuf::from).collect();
  let project_data = parser::parse_files(paths);
  serde_json::to_string(&project_data).unwrap_or_default()
}

use archest_core::parser::{self, ProjectData};
use archest_core::rules;

#[derive(uniffi::Object)]
pub struct ArchestProject {
    project_data: ProjectData,
}

#[uniffi::export]
impl ArchestProject {
    #[uniffi::constructor]
    pub fn parse(files: Vec<String>) -> Self {
        let paths: Vec<std::path::PathBuf> = files.into_iter().map(std::path::PathBuf::from).collect();
        let project_data = parser::parse_files(paths);
        Self { project_data }
    }

    pub fn check_file_cycles(&self, locator_files: Vec<String>, is_not: bool) -> JvmRuleResult {
        let res = rules::files::check_be_free_of_cycles(&self.project_data, &locator_files, is_not);
        JvmRuleResult {
            pass: res.pass,
            message: res.message,
        }
    }

    pub fn get_project_data_json(&self) -> String {
        serde_json::to_string(&self.project_data).unwrap_or_default()
    }
}

#[derive(uniffi::Record)]
pub struct JvmRuleResult {
    pub pass: bool,
    pub message: String,
}

uniffi::setup_scaffolding!();

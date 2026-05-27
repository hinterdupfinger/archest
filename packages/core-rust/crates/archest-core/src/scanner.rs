use ignore::WalkBuilder;
use std::path::PathBuf;

pub fn scan_directory(path: &str) -> Vec<PathBuf> {
  let mut files = Vec::new();

  let walker = WalkBuilder::new(path)
    .hidden(true)
    .git_ignore(true)
    .build();

  for result in walker {
    if let Ok(entry) = result {
      if entry.file_type().map_or(false, |ft| ft.is_file()) {
        let path = entry.path();
        if let Some(ext) = path.extension() {
          let ext_str = ext.to_string_lossy();
          if ext_str == "ts"
            || ext_str == "tsx"
            || ext_str == "vue"
            || ext_str == "svelte"
            || ext_str == "java"
            || ext_str == "kt"
          {
            files.push(path.to_path_buf());
          }
        }
      }
    }
  }

  files
}

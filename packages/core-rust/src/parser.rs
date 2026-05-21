use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tree_sitter::{Node, Parser};

const HTML_LIKE_EXTENSIONS: [&str; 2] = ["vue", "svelte"];

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct ProjectData {
  pub files: Vec<FileData>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct FileData {
  pub path: String,
  pub classes: Vec<ClassData>,
  pub functions: Vec<FunctionData>,
  pub properties: Vec<PropertyData>,
  pub dependencies: Vec<String>,
  pub external_dependencies: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ClassData {
  pub name: Option<String>,
  pub is_exported: bool,
  pub is_default: bool,
  pub is_abstract: bool,
  pub extends: Option<String>,
  pub implements: Vec<String>,
  pub decorators: Vec<String>,
  pub cyclomatic_complexity: u32,
  pub maintainability_index: u32,
}

impl Default for ClassData {
  fn default() -> Self {
    Self {
      name: None,
      is_exported: false,
      is_default: false,
      is_abstract: false,
      extends: None,
      implements: Vec::new(),
      decorators: Vec::new(),
      cyclomatic_complexity: 1,
      maintainability_index: 100,
    }
  }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FunctionData {
  pub name: Option<String>,
  pub is_exported: bool,
  pub is_async: bool,
  pub is_top_level: bool,
  pub has_explicit_return_type: bool,
  pub cyclomatic_complexity: u32,
  pub maintainability_index: u32,
}

impl Default for FunctionData {
  fn default() -> Self {
    Self {
      name: None,
      is_exported: false,
      is_async: false,
      is_top_level: false,
      has_explicit_return_type: false,
      cyclomatic_complexity: 1,
      maintainability_index: 100,
    }
  }
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct PropertyData {
  pub name: String,
  pub is_readonly: bool,
}

pub fn parse_files(files: Vec<PathBuf>) -> ProjectData {
  let mut project_data = ProjectData::default();

  for file in files {
    let mut file_data = FileData {
      path: file.to_string_lossy().to_string(),
      ..Default::default()
    };

    if let Ok(content) = fs::read_to_string(&file) {
      let mut script_content = content.clone();

      let ext = file.extension().unwrap_or_default().to_string_lossy();
      if HTML_LIKE_EXTENSIONS.contains(&ext.as_ref()) {
        let mut html_parser = Parser::new();
        html_parser.set_language(&tree_sitter_html::language().into()).unwrap();
        if let Some(tree) = html_parser.parse(&script_content, None) {
          let root = tree.root_node();
          let mut script_found = false;
          let mut cursor = root.walk();
          for child in root.children(&mut cursor) {
            if child.kind() == "element" || child.kind() == "script_element" {
               // Try to find script_element or element with start_tag "script"
               if child.kind() == "script_element" {
                 if let Some(raw_text) = child.child_by_field_name("text") {
                    script_content = get_text(raw_text, &content).to_string();
                    script_found = true;
                    break;
                 }
                 // sometimes the content is just named raw_text
                 for c in child.children(&mut child.walk()) {
                    if c.kind() == "raw_text" {
                       script_content = get_text(c, &content).to_string();
                       script_found = true;
                       break;
                    }
                 }
               }
            }
          }
          if !script_found {
             script_content = String::new();
          }
        } else {
          script_content = String::new();
        }
      }

      let mut parser = Parser::new();
      let language = if ext == "tsx" {
        tree_sitter_typescript::language_tsx()
      } else {
        tree_sitter_typescript::language_typescript()
      };
      
      parser.set_language(&language.into()).unwrap();
      
      if let Some(tree) = parser.parse(&script_content, None) {
        let root = tree.root_node();
        traverse_node(root, &script_content, &mut file_data);
      }
    }
    
    project_data.files.push(file_data);
  }

  project_data
}

fn traverse_node(node: Node, source: &str, file_data: &mut FileData) {
  let kind = node.kind();

  if kind == "class_declaration" || kind == "class" {
    let mut class_data = ClassData::default();
    
    if let Some(parent) = node.parent() {
      if parent.kind() == "export_statement" {
        class_data.is_exported = true;
      }
    }

    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
      let child_kind = child.kind();
      if child_kind == "default" {
        class_data.is_default = true;
      }
      if child_kind == "abstract" {
        class_data.is_abstract = true;
      }
      if child_kind == "type_identifier" || child_kind == "identifier" {
        class_data.name = Some(get_text(child, source).to_string());
      }
      if child_kind == "class_heritage" {
        let mut h_cursor = child.walk();
        for h_child in child.children(&mut h_cursor) {
          if h_child.kind() == "extends_clause" {
             let mut ex_cursor = h_child.walk();
             for ex_child in h_child.children(&mut ex_cursor) {
               if ex_child.kind() == "identifier" || ex_child.kind() == "type_identifier" {
                 class_data.extends = Some(get_text(ex_child, source).to_string());
               }
             }
          }
          if h_child.kind() == "implements_clause" {
             let mut im_cursor = h_child.walk();
             for im_child in h_child.children(&mut im_cursor) {
               if im_child.kind() == "type_identifier" || im_child.kind() == "identifier" {
                 class_data.implements.push(get_text(im_child, source).to_string());
               }
             }
          }
        }
      }
      // Decorators
      if child_kind == "decorator" {
         let mut d_cursor = child.walk();
         for d_child in child.children(&mut d_cursor) {
           if d_child.kind() == "identifier" || d_child.kind() == "call_expression" {
              class_data.decorators.push(get_text(d_child, source).to_string());
           }
         }
      }
      
      // Properties
      if child_kind == "class_body" {
         let mut b_cursor = child.walk();
         for b_child in child.children(&mut b_cursor) {
           if b_child.kind() == "public_field_definition" || b_child.kind() == "method_definition" {
              let mut prop_cursor = b_child.walk();
              let mut is_readonly = false;
              let mut prop_name = String::new();
              for p_child in b_child.children(&mut prop_cursor) {
                 if p_child.kind() == "readonly" {
                   is_readonly = true;
                 }
                 if p_child.kind() == "property_identifier" {
                   prop_name = get_text(p_child, source).to_string();
                 }
              }
              if !prop_name.is_empty() {
                if b_child.kind() == "public_field_definition" {
                  file_data.properties.push(PropertyData {
                    name: prop_name.clone(),
                    is_readonly,
                  });
                }
                if b_child.kind() == "method_definition" {
                   // Methods are also functions conceptually, but in vitest-arch TS program they were returned via isMethodDeclaration
                   let mut func_data = FunctionData {
                     name: Some(prop_name.clone()),
                     ..Default::default()
                   };
                   
                   let mut c = b_child.walk();
                   for fc in b_child.children(&mut c) {
                     if fc.kind() == "async" { func_data.is_async = true; }
                     if fc.kind() == "type_annotation" { func_data.has_explicit_return_type = true; }
                   }
                   file_data.functions.push(func_data);
                }
              }
           }
         }
      }
    }
    file_data.classes.push(class_data);
  }

  if kind == "function_declaration" || kind == "arrow_function" || kind == "method_definition" {
    let mut func_data = FunctionData::default();
    
    if let Some(parent) = node.parent() {
      if parent.kind() == "export_statement" || parent.kind() == "lexical_declaration" && parent.parent().map_or(false, |p| p.kind() == "export_statement") {
        func_data.is_exported = true;
      }
      
      let p_kind = parent.kind();
      if p_kind == "program" || p_kind == "export_statement" && parent.parent().map_or(false, |p| p.kind() == "program") || p_kind == "lexical_declaration" && parent.parent().map_or(false, |p| p.kind() == "program") {
        func_data.is_top_level = true;
      }
    }
    
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
      let child_kind = child.kind();
      if child_kind == "async" {
        func_data.is_async = true;
      }
      if child_kind == "identifier" || child_kind == "property_identifier" {
        func_data.name = Some(get_text(child, source).to_string());
      }
      if child_kind == "type_annotation" || child_kind == "return_statement" {
        // Technically return_type is what we want for has_explicit_return_type
      }
    }
    
    // For explicit return type, look at type_annotation which follows formal_parameters
    if kind == "function_declaration" {
      if let Some(params) = node.child_by_field_name("parameters") {
         if let Some(next_sibling) = params.next_sibling() {
           if next_sibling.kind() == "type_annotation" {
             func_data.has_explicit_return_type = true;
           }
         }
      }
    } else if kind == "arrow_function" {
      // similar logic
      if let Some(params) = node.child_by_field_name("parameters") {
         if let Some(next_sibling) = params.next_sibling() {
           if next_sibling.kind() == "type_annotation" {
             func_data.has_explicit_return_type = true;
           }
         }
      }
    }

    if kind != "method_definition" { // Added above
      file_data.functions.push(func_data);
    }
  }

  if kind == "import_statement" || kind == "export_statement" {
    if let Some(source_node) = node.child_by_field_name("source") {
      let mut path = get_text(source_node, source).to_string();
      // Remove quotes
      if path.len() >= 2 {
        path = path[1..path.len() - 1].to_string();
      }
      
      // Filter out absolute module imports to somewhat match the TS `!isExternalLibraryImport` logic
      if path.starts_with('.') || path.starts_with('/') {
        // Very basic resolution assuming standard typescript extensions
        let mut resolved = path.clone();
        if !resolved.ends_with(".ts") && !resolved.ends_with(".tsx") && !resolved.ends_with(".vue") && !resolved.ends_with(".svelte") {
           // We just append .ts for mocking the dependency graph in tests, this might need more logic
           resolved.push_str(".ts");
        }
        file_data.dependencies.push(resolved);
      } else {
        // External dependencies like 'vue', 'gql-tada', etc.
        file_data.external_dependencies.push(path);
      }
    }
  }

  let mut cursor = node.walk();
  for child in node.children(&mut cursor) {
    traverse_node(child, source, file_data);
  }
}

fn get_text<'a>(node: Node, source: &'a str) -> &'a str {
  &source[node.byte_range()]
}

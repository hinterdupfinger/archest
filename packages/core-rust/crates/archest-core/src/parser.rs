use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};
use tree_sitter::{Node, Parser};

#[cfg(feature = "typescript")]
const HTML_LIKE_EXTENSIONS: [&str; 2] = ["vue", "svelte"];
#[cfg(feature = "jvm")]
const JVM_EXTENSIONS: [&str; 2] = ["java", "kt"];

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ProjectData {
  pub files: Vec<FileData>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct FileData {
  pub path: String,
  pub classes: Vec<ClassData>,
  pub functions: Vec<FunctionData>,
  pub properties: Vec<PropertyData>,
  pub dependencies: Vec<String>,
  pub external_dependencies: Vec<String>,
  pub type_dependencies: Vec<String>,
  pub external_type_dependencies: Vec<String>,
  #[serde(skip)]
  pub raw_imports: Vec<RawImport>,
  #[serde(rename = "package_name")]
  pub package_name: Option<String>,
  #[serde(skip)]
  pub tokens: HashSet<String>,
}

#[derive(Debug, Clone)]
pub struct RawImport {
  pub path: String,
  pub is_wildcard: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct PropertyData {
  pub name: String,
  pub is_readonly: bool,
}

pub fn parse_files(files: Vec<PathBuf>) -> ProjectData {
  let mut project_data = ProjectData::default();
  
  // Maps to help resolve Java/Kotlin class imports
  // Map of Fully Qualified Class Name (FQCN) -> File Path
  #[cfg(feature = "jvm")]
  let mut class_to_file_map: HashMap<String, String> = HashMap::new();
  // Map of Package Name -> List of (Class Name, File Path)
  #[cfg(feature = "jvm")]
  let mut package_to_classes_map: HashMap<String, Vec<(String, String)>> = HashMap::new();

  // PASS 1: Parse AST details and collect packages, imports, tokens, and classes
  for file in &files {
    let mut file_data = FileData {
      path: file.to_string_lossy().to_string(),
      ..Default::default()
    };

    if let Ok(content) = fs::read_to_string(file) {
      // Collect tokens for same-package class resolution
      #[cfg(feature = "jvm")]
      {
        for word in content.split(|c: char| !c.is_alphanumeric() && c != '_') {
          if !word.is_empty() {
            file_data.tokens.insert(word.to_string());
          }
        }
      }

      let ext = file.extension().unwrap_or_default().to_string_lossy().to_string();
      
      #[cfg(feature = "jvm")]
      {
        if JVM_EXTENSIONS.contains(&ext.as_str()) {
          parse_jvm_file(&content, &ext, &mut file_data);
          
          // Populate FQCN map
          let package_prefix = file_data.package_name.as_deref().unwrap_or("");
          for class in &file_data.classes {
            if let Some(ref class_name) = class.name {
              let fqcn = if package_prefix.is_empty() {
                class_name.clone()
              } else {
                format!("{}.{}", package_prefix, class_name)
              };
              class_to_file_map.insert(fqcn, file_data.path.clone());
              
              package_to_classes_map
                .entry(package_prefix.to_string())
                .or_default()
                .push((class_name.clone(), file_data.path.clone()));
            }
          }
        }
      }
      
      #[cfg(feature = "typescript")]
      {
        let is_html_like = HTML_LIKE_EXTENSIONS.contains(&ext.as_str());
        let is_js_ts = ext == "ts" || ext == "tsx" || ext == "js" || ext == "jsx" || is_html_like;
        if is_js_ts {
          let mut script_content = content.clone();
          if is_html_like {
            script_content = extract_html_script(&content);
          }
          parse_js_ts_file(&script_content, &ext, &mut file_data);
        }
      }
    }
    project_data.files.push(file_data);
  }

  // PASS 2: Resolve imports and same-package dependencies for Java/Kotlin
  #[cfg(feature = "jvm")]
  {
    for file_data in &mut project_data.files {
      let ext = Path::new(&file_data.path).extension().unwrap_or_default().to_string_lossy().to_string();
      if !JVM_EXTENSIONS.contains(&ext.as_str()) {
        continue;
      }

      let current_package = file_data.package_name.as_deref().unwrap_or("");

      // 1. Resolve raw import statements
      for import in &file_data.raw_imports {
        if import.is_wildcard {
          // e.g. import com.example.services.*;
          if let Some(classes) = package_to_classes_map.get(&import.path) {
            for (_, path) in classes {
              if path != &file_data.path {
                file_data.dependencies.push(path.clone());
              }
            }
          }
        } else {
          // e.g. import com.example.services.UserService;
          if let Some(path) = class_to_file_map.get(&import.path) {
            if path != &file_data.path {
              file_data.dependencies.push(path.clone());
            }
          } else {
            file_data.external_dependencies.push(import.path.clone());
          }
        }
      }

      // 2. Resolve implicit same-package dependencies (no import statements required)
      if !current_package.is_empty() {
        if let Some(classes) = package_to_classes_map.get(current_package) {
          for (class_name, path) in classes {
            if path != &file_data.path && file_data.tokens.contains(class_name) {
              file_data.dependencies.push(path.clone());
            }
          }
        }
      }

      // Deduplicate dependencies
      let dep_set: HashSet<String> = file_data.dependencies.drain(..).collect();
      file_data.dependencies = dep_set.into_iter().collect();
      
      let ext_dep_set: HashSet<String> = file_data.external_dependencies.drain(..).collect();
      file_data.external_dependencies = ext_dep_set.into_iter().collect();
    }
  }

  project_data
}

#[cfg(feature = "typescript")]
fn extract_html_script(content: &str) -> String {
  let mut html_parser = Parser::new();
  html_parser.set_language(&tree_sitter_html::language().into()).unwrap();
  if let Some(tree) = html_parser.parse(content, None) {
    let root = tree.root_node();
    let mut cursor = root.walk();
    for child in root.children(&mut cursor) {
      if child.kind() == "element" || child.kind() == "script_element" {
        if child.kind() == "script_element" {
          if let Some(raw_text) = child.child_by_field_name("text") {
            return get_text(raw_text, content).to_string();
          }
          for c in child.children(&mut child.walk()) {
            if c.kind() == "raw_text" {
              return get_text(c, content).to_string();
            }
          }
        }
      }
    }
  }
  String::new()
}

#[cfg(feature = "typescript")]
fn parse_js_ts_file(source: &str, ext: &str, file_data: &mut FileData) {
  let mut parser = Parser::new();
  let language = if ext == "tsx" {
    tree_sitter_typescript::language_tsx()
  } else {
    tree_sitter_typescript::language_typescript()
  };
  parser.set_language(&language.into()).unwrap();

  if let Some(tree) = parser.parse(source, None) {
    traverse_js_ts_node(tree.root_node(), source, file_data);
  }
}

#[cfg(feature = "typescript")]
fn traverse_js_ts_node(node: Node, source: &str, file_data: &mut FileData) {
  let kind = node.kind();

  if kind == "class_declaration" || kind == "class" {
    if kind == "class" && node.parent().map_or(false, |p| p.kind() == "class_declaration") {
      let mut cursor = node.walk();
      for child in node.children(&mut cursor) {
        traverse_js_ts_node(child, source, file_data);
      }
      return;
    }

    let mut class_data = ClassData::default();
    if let Some(parent) = node.parent() {
      if parent.kind() == "export_statement" {
        class_data.is_exported = true;
        let mut p_cursor = parent.walk();
        for p_child in parent.children(&mut p_cursor) {
          if p_child.kind() == "decorator" {
            let mut d_cursor = p_child.walk();
            for d_child in p_child.children(&mut d_cursor) {
              if d_child.kind() == "identifier" {
                class_data.decorators.push(get_text(d_child, source).to_string());
              } else if d_child.kind() == "call_expression" {
                if let Some(func_node) = d_child.child_by_field_name("function") {
                  class_data.decorators.push(get_text(func_node, source).to_string());
                } else {
                  class_data.decorators.push(get_text(d_child, source).to_string());
                }
              }
            }
          }
        }
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
      if child_kind == "decorator" {
        let mut d_cursor = child.walk();
        for d_child in child.children(&mut d_cursor) {
          if d_child.kind() == "identifier" {
            class_data.decorators.push(get_text(d_child, source).to_string());
          } else if d_child.kind() == "call_expression" {
            if let Some(func_node) = d_child.child_by_field_name("function") {
              class_data.decorators.push(get_text(func_node, source).to_string());
            } else {
              class_data.decorators.push(get_text(d_child, source).to_string());
            }
          }
        }
      }
      if child_kind == "class_body" {
        let mut b_cursor = child.walk();
        for b_child in child.children(&mut b_cursor) {
          let b_kind = b_child.kind();
          if b_kind == "public_field_definition" || b_kind == "method_definition" {
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
              if b_kind == "public_field_definition" {
                file_data.properties.push(PropertyData {
                  name: prop_name.clone(),
                  is_readonly,
                });
              }
              if b_kind == "method_definition" {
                let mut func_data = FunctionData {
                  name: Some(prop_name.clone()),
                  cyclomatic_complexity: calculate_complexity(b_child, source),
                  maintainability_index: calculate_maintainability_index(b_child, source),
                  ..Default::default()
                };
                let mut c = b_child.walk();
                for fc in b_child.children(&mut c) {
                  if fc.kind() == "async" {
                    func_data.is_async = true;
                  }
                  if fc.kind() == "type_annotation" {
                    func_data.has_explicit_return_type = true;
                  }
                }
                file_data.functions.push(func_data);
              }
            }
          }
        }
      }
    }
    class_data.cyclomatic_complexity = calculate_complexity(node, source);
    class_data.maintainability_index = calculate_maintainability_index(node, source);
    file_data.classes.push(class_data);
  }

  if kind == "function_declaration" || kind == "arrow_function" || kind == "method_definition" {
    let mut func_data = FunctionData::default();
    if let Some(parent) = node.parent() {
      if parent.kind() == "export_statement"
        || parent.kind() == "lexical_declaration"
          && parent.parent().map_or(false, |p| p.kind() == "export_statement")
      {
        func_data.is_exported = true;
      }
      let p_kind = parent.kind();
      if p_kind == "program"
        || p_kind == "export_statement" && parent.parent().map_or(false, |p| p.kind() == "program")
        || p_kind == "lexical_declaration" && parent.parent().map_or(false, |p| p.kind() == "program")
      {
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
    }
    if kind == "function_declaration" {
      if let Some(params) = node.child_by_field_name("parameters") {
        if let Some(next_sibling) = params.next_sibling() {
          if next_sibling.kind() == "type_annotation" {
            func_data.has_explicit_return_type = true;
          }
        }
      }
    } else if kind == "arrow_function" {
      if let Some(params) = node.child_by_field_name("parameters") {
        if let Some(next_sibling) = params.next_sibling() {
          if next_sibling.kind() == "type_annotation" {
            func_data.has_explicit_return_type = true;
          }
        }
      }
    }

    func_data.cyclomatic_complexity = calculate_complexity(node, source);
    func_data.maintainability_index = calculate_maintainability_index(node, source);

    if kind != "method_definition" {
      file_data.functions.push(func_data);
    }
  }

  if kind == "import_statement" || kind == "export_statement" {
    if let Some(source_node) = node.child_by_field_name("source") {
      let mut path = get_text(source_node, source).to_string();
      if path.len() >= 2 {
        path = path[1..path.len() - 1].to_string();
      }
      let mut is_type_only = false;
      let mut cursor = node.walk();
      for child in node.children(&mut cursor) {
        if child.kind() == "type" {
          is_type_only = true;
          break;
        }
      }
      if path.starts_with('.') || path.starts_with('/') {
        let mut resolved = path.clone();
        if !resolved.ends_with(".ts")
          && !resolved.ends_with(".tsx")
          && !resolved.ends_with(".vue")
          && !resolved.ends_with(".svelte")
        {
          resolved.push_str(".ts");
        }
        if is_type_only {
          file_data.type_dependencies.push(resolved);
        } else {
          file_data.dependencies.push(resolved);
        }
      } else {
        if is_type_only {
          file_data.external_type_dependencies.push(path);
        } else {
          file_data.external_dependencies.push(path);
        }
      }
    }
  }

  let mut cursor = node.walk();
  for child in node.children(&mut cursor) {
    traverse_js_ts_node(child, source, file_data);
  }
}

// Java and Kotlin parser implementation
#[cfg(feature = "jvm")]
fn parse_jvm_file(source: &str, ext: &str, file_data: &mut FileData) {
  let mut parser = Parser::new();
  let language = if ext == "java" {
    tree_sitter_java::language()
  } else {
    tree_sitter_kotlin::language()
  };
  parser.set_language(&language.into()).unwrap();

  if let Some(tree) = parser.parse(source, None) {
    traverse_jvm_node(tree.root_node(), source, ext, file_data);
  }
}

#[cfg(feature = "jvm")]
fn traverse_jvm_node(node: Node, source: &str, ext: &str, file_data: &mut FileData) {
  let kind = node.kind();

  // Package Header Resolution
  if (ext == "java" && kind == "package_declaration") || (ext == "kt" && kind == "package_header") {
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
      if child.kind() == "scoped_identifier" || child.kind() == "identifier" || child.kind() == "simple_identifier" {
        file_data.package_name = Some(get_text(child, source).to_string());
      }
    }
  }

  // Imports Resolution
  if (ext == "java" && kind == "import_declaration") || (ext == "kt" && kind == "import_header") {
    let mut import_path = String::new();
    let mut is_wildcard = false;
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
      let child_kind = child.kind();
      if child_kind == "scoped_identifier" || child_kind == "identifier" || child_kind == "simple_identifier" {
        import_path = get_text(child, source).to_string();
      }
      if child_kind == "asterisk" || child_kind == "wildcard" {
        is_wildcard = true;
      }
    }
    if !import_path.is_empty() {
      file_data.raw_imports.push(RawImport {
        path: import_path,
        is_wildcard,
      });
    }
  }

  // Class and Interface declaration resolution
  if kind == "class_declaration" || kind == "interface_declaration" || kind == "enum_declaration" || kind == "record_declaration" {
    let mut class_data = ClassData::default();
    class_data.is_exported = true; // Classes in Java/Kotlin are public/exported by default

    // Parse class modifiers
    if let Some(modifiers) = node.child_by_field_name("modifiers") {
      let mut cursor = modifiers.walk();
      for child in modifiers.children(&mut cursor) {
        if child.kind() == "abstract" {
          class_data.is_abstract = true;
        }
      }
    }

    if let Some(name_node) = node.child_by_field_name("name") {
      class_data.name = Some(get_text(name_node, source).to_string());
    }

    // Java inheritance: extends/implements
    if ext == "java" {
      if let Some(superclass) = node.child_by_field_name("superclass") {
        let mut cursor = superclass.walk();
        for child in superclass.children(&mut cursor) {
          if child.kind() == "type_identifier" || child.kind() == "scoped_type_identifier" {
            class_data.extends = Some(get_text(child, source).to_string());
          }
        }
      }
      if let Some(interfaces) = node.child_by_field_name("interfaces") {
        let mut cursor = interfaces.walk();
        for child in interfaces.children(&mut cursor) {
          if child.kind() == "type_list" {
            for c in child.children(&mut child.walk()) {
              if c.kind() == "type_identifier" {
                class_data.implements.push(get_text(c, source).to_string());
              }
            }
          }
        }
      }
    }

    // Kotlin inheritance: delegation specifiers
    if ext == "kt" {
      if let Some(delegation_specifiers) = node.child_by_field_name("delegation_specifiers") {
        let mut cursor = delegation_specifiers.walk();
        for child in delegation_specifiers.children(&mut cursor) {
          // Can be user_type (implements) or constructor_invocation (extends)
          let child_kind = child.kind();
          if child_kind == "user_type" {
            class_data.implements.push(get_text(child, source).to_string());
          }
          if child_kind == "constructor_invocation" {
            let mut c_cursor = child.walk();
            for c_child in child.children(&mut c_cursor) {
              if c_child.kind() == "user_type" {
                class_data.extends = Some(get_text(c_child, source).to_string());
              }
            }
          }
        }
      }
    }

    // Parse Annotations/Decorators
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
      let child_kind = child.kind();
      if child_kind == "modifiers" {
        for c in child.children(&mut child.walk()) {
          if c.kind() == "marker_annotation" || c.kind() == "annotation" {
            class_data.decorators.push(get_text(c, source).to_string());
          }
        }
      }
    }

    // Parse fields/properties
    if let Some(body) = node.child_by_field_name("body") {
      let mut b_cursor = body.walk();
      for b_child in body.children(&mut b_cursor) {
        let b_kind = b_child.kind();
        
        // Java Fields
        if ext == "java" && b_kind == "field_declaration" {
          let mut is_readonly = false;
          if let Some(modifiers) = b_child.child_by_field_name("modifiers") {
            for m in modifiers.children(&mut modifiers.walk()) {
              if m.kind() == "final" {
                is_readonly = true;
              }
            }
          }
          if let Some(declarator) = b_child.child_by_field_name("declarator") {
            if let Some(name_node) = declarator.child_by_field_name("name") {
              file_data.properties.push(PropertyData {
                name: get_text(name_node, source).to_string(),
                is_readonly,
              });
            }
          }
        }

        // Kotlin Properties
        if ext == "kt" && b_kind == "property_declaration" {
          let mut is_readonly = true;
          // check if declared with 'var' instead of 'val'
          for c in b_child.children(&mut b_child.walk()) {
            if c.kind() == "var" {
              is_readonly = false;
            }
          }
          if let Some(variable) = b_child.child_by_field_name("variable_declaration") {
            if let Some(name_node) = variable.child_by_field_name("simple_identifier") {
              file_data.properties.push(PropertyData {
                name: get_text(name_node, source).to_string(),
                is_readonly,
              });
            }
          }
        }
      }
    }

    class_data.cyclomatic_complexity = calculate_complexity(node, source);
    class_data.maintainability_index = calculate_maintainability_index(node, source);
    file_data.classes.push(class_data);
  }

  // Methods and Functions resolution
  if (ext == "java" && kind == "method_declaration") || (ext == "kt" && kind == "function_declaration") {
    let mut func_data = FunctionData::default();
    func_data.is_exported = true;
    func_data.has_explicit_return_type = true; // In Java, methods always declare explicit return types

    if ext == "kt" {
      // Kotlin top level functions check
      if let Some(parent) = node.parent() {
        if parent.kind() == "kotlin_file" {
          func_data.is_top_level = true;
        }
      }
      // Check if function has 'suspend' modifier (async)
      if let Some(modifiers) = node.child_by_field_name("modifiers") {
        for child in modifiers.children(&mut modifiers.walk()) {
          if child.kind() == "suspend" {
            func_data.is_async = true;
          }
        }
      }
      // Check if Kotlin has explicit return type annotation
      func_data.has_explicit_return_type = node.child_by_field_name("type").is_some();
    }

    if let Some(name_node) = node.child_by_field_name("name") {
      func_data.name = Some(get_text(name_node, source).to_string());
    }

    func_data.cyclomatic_complexity = calculate_complexity(node, source);
    func_data.maintainability_index = calculate_maintainability_index(node, source);
    file_data.functions.push(func_data);
  }

  let mut cursor = node.walk();
  for child in node.children(&mut cursor) {
    traverse_jvm_node(child, source, ext, file_data);
  }
}

fn calculate_complexity(node: Node, _source: &str) -> u32 {
  let mut complexity = 1;
  let mut stack = vec![node];

  while let Some(current) = stack.pop() {
    let kind = current.kind();
    match kind {
      "if_statement" | "if_expression"
      | "for_statement" | "for_in_statement" | "for_of_statement" | "enhanced_for_statement"
      | "while_statement" | "do_statement" | "do_while_statement"
      | "catch_clause" | "catch_block" | "switch_label" | "switch_case" | "switch_default"
      | "when_entry" | "ternary_expression" => {
        complexity += 1;
      }
      "binary_expression" => {
        for child in current.children(&mut current.walk()) {
          let c_kind = child.kind();
          if c_kind == "&&" || c_kind == "||" || c_kind == "amp_amp" || c_kind == "bar_bar" || c_kind == "??" || c_kind == "?:" || c_kind == "elvis" {
            complexity += 1;
          }
        }
      }
      _ => {}
    }

    let mut child_cursor = current.walk();
    for child in current.children(&mut child_cursor) {
      stack.push(child);
    }
  }
  complexity
}

fn calculate_maintainability_index(node: Node, source: &str) -> u32 {
  let complexity = calculate_complexity(node, source) as f64;
  
  // Count lines of code (LOC)
  let byte_range = node.byte_range();
  let code_segment = &source[byte_range];
  let loc = code_segment.lines().count() as f64;
  
  // Halstead Volume estimation (simple approximation based on length and vocabulary)
  let word_count = code_segment.split_whitespace().count() as f64;
  let unique_words: HashSet<&str> = code_segment.split_whitespace().collect();
  let vocabulary = unique_words.len() as f64;
  
  let volume = if vocabulary > 0.0 && word_count > 0.0 {
    word_count * vocabulary.log2()
  } else {
    1.0
  };

  // Maintainability Index Formula:
  // MI = 171 - 5.2 * ln(V) - 0.23 * G - 16.2 * ln(LOC)
  let mi = 171.0 - 5.2 * volume.ln().max(0.1) - 0.23 * complexity - 16.2 * loc.ln().max(0.1);
  let mi_clamped = mi.max(0.0).min(100.0);
  
  mi_clamped as u32
}

fn get_text<'a>(node: Node, source: &'a str) -> &'a str {
  &source[node.byte_range()]
}

#[cfg(all(test, feature = "typescript"))]
mod tests {
  use super::*;

  #[test]
  fn test_cyclomatic_complexity() {
    let source = r#"
      function testComplexity(x) {
        if (x > 10) {
          if (x < 20) {
            return 1;
          }
          return 2;
        }
        switch (x) {
          case 1:
            return 4;
          case 2:
            return 5;
          default:
            return 6;
        }
        let y = x ?? 10;
        return y > 5 ? 7 : 8;
      }
    "#;
    let mut file_data = FileData::default();
    parse_js_ts_file(source, "ts", &mut file_data);
    assert_eq!(file_data.functions.len(), 1);
    assert_eq!(file_data.functions[0].cyclomatic_complexity, 8);
  }

  #[test]
  fn test_type_only_imports() {
    let source = r#"
      import type { Foo } from './foo';
      import { Bar } from './bar';
      import type DefaultType from 'external-type';
      import ExternalVal from 'external-val';
    "#;
    let mut file_data = FileData::default();
    parse_js_ts_file(source, "ts", &mut file_data);
    assert_eq!(file_data.dependencies, vec!["./bar.ts"]);
    assert_eq!(file_data.type_dependencies, vec!["./foo.ts"]);
    assert_eq!(file_data.external_dependencies, vec!["external-val"]);
    assert_eq!(file_data.external_type_dependencies, vec!["external-type"]);
  }

  #[test]
  fn test_maintainability_index() {
    let simple_source = r#"
      function simple() {
        return 1;
      }
    "#;
    let complex_source = r#"
      function complex(x) {
        let a = 1;
        let b = 2;
        let c = 3;
        let d = 4;
        let e = 5;
        let f = 6;
        let g = 7;
        let h = 8;
        let i = 9;
        let j = 10;
        if (x > 10) {
          a = a + 1;
          if (x < 20) {
            b = b + 1;
            if (x == 15) {
              c = c + 1;
              if (a > b) {
                d = d + 1;
              }
            }
          }
          if (x == 18) {
            e = e + 1;
          }
          return a + b + c + d + e;
        }
        switch (x) {
          case 1:
            f = f + 1;
            break;
          case 2:
            g = g + 1;
            break;
          case 3:
            h = h + 1;
            break;
          default:
            i = i + 1;
        }
        let y = x ?? 10;
        return y > 5 ? f + g + h + i + j : 0;
      }
    "#;
    
    let mut simple_data = FileData::default();
    parse_js_ts_file(simple_source, "ts", &mut simple_data);
    assert_eq!(simple_data.functions.len(), 1);
    let simple_mi = simple_data.functions[0].maintainability_index;
    
    let mut complex_data = FileData::default();
    parse_js_ts_file(complex_source, "ts", &mut complex_data);
    assert_eq!(complex_data.functions.len(), 1);
    let complex_mi = complex_data.functions[0].maintainability_index;

    // Simple function should be highly maintainable (usually close to 100)
    assert!(simple_mi > 90);
    // Complex function should have a lower maintainability score (clamped or unclamped)
    assert!(complex_mi < simple_mi, "Expected complex MI ({}) to be less than simple MI ({})", complex_mi, simple_mi);
  }
}

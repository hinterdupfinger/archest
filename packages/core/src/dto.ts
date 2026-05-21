/**
 * Represents the entire parsed project structure containing all analyzed files.
 * This is the root node returned by the native Rust parser.
 */
export interface ProjectData {
  /** A list of all files that were successfully parsed in the project workspace. */
  files: FileData[];
}

/**
 * Represents a single source file in the project.
 * Contains information about its path, dependencies, and all nested code blocks.
 */
export interface FileData {
  /** The absolute path to the file. */
  path: string;
  /** An array of all classes defined within this file. */
  classes: ClassData[];
  /** An array of all top-level or exported functions defined within this file. */
  functions: FunctionData[];
  /** An array of properties extracted from classes or objects in the file. */
  properties: PropertyData[];
  /** An array of raw module paths this file imports (e.g., './utils', 'react'). */
  dependencies?: string[];
}

/**
 * Represents a class declaration extracted from a TypeScript or JavaScript file.
 * Includes architectural metadata such as its hierarchy and complexity.
 */
export interface ClassData {
  /** The name of the class, or null if it is an anonymous class. */
  name: string | null;
  /** True if the class has an 'export' modifier. */
  is_exported: boolean;
  /** True if the class has an 'export default' modifier. */
  is_default: boolean;
  /** True if the class is marked as abstract. */
  is_abstract: boolean;
  /** The name of the parent class it extends, if any. */
  extends: string | null;
  /** An array of interface names this class implements. */
  implements: string[];
  /** An array of decorator names applied to the class. */
  decorators: string[];
  /** The computed McCabe cyclomatic complexity of the class methods. */
  cyclomatic_complexity?: number;
  /** The computed Halstead maintainability index (0-100). */
  maintainability_index?: number;
}

/**
 * Represents a function declaration or arrow function extracted from a file.
 */
export interface FunctionData {
  /** The name of the function, or null if anonymous. */
  name: string | null;
  /** True if the function is exported from the file. */
  is_exported: boolean;
  /** True if the function is marked as async. */
  is_async: boolean;
  /** True if the function is defined at the root level of the file context. */
  is_top_level: boolean;
  /** True if the function explicitly declares a return type. */
  has_explicit_return_type: boolean;
  /** The computed McCabe cyclomatic complexity of the function body. */
  cyclomatic_complexity?: number;
  /** The computed Halstead maintainability index (0-100). */
  maintainability_index?: number;
}

/**
 * Represents a class property or interface member extracted from the AST.
 */
export interface PropertyData {
  /** The name of the property. */
  name: string;
  /** True if the property is marked with the 'readonly' modifier. */
  is_readonly: boolean;
}

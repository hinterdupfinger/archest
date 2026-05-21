import type { FunctionData, ProjectData } from '../dto';

export interface FunctionLocatorData {
  type: 'FunctionLocator';
  functions: (FunctionData & { _filePath: string })[];
  projectData: ProjectData;
}

/**
 * Options to filter functions when querying the AST via `getFunctions()`.
 */
export interface FunctionQueryOptions {
  /** Filters functions to only include those residing in a specific folder path. */
  inFolder?: string;
  /** Filters functions by a string or RegExp matching their name. */
  matchNamePattern?: string | RegExp;
  /** Filters functions to only include top-level functions (not nested or methods). */
  isTopLevel?: boolean;
}

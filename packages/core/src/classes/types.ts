import type { ClassData, ProjectData } from '../dto';

export interface ClassLocatorData {
  type: 'ClassLocator';
  classes: (ClassData & { _filePath: string })[];
  projectData: ProjectData;
}

/**
 * Options to filter classes when querying the AST via `getClasses()`.
 */
export interface ClassQueryOptions {
  /** Filters classes to only include those residing in a specific folder path. */
  inFolder?: string;
  /** Filters classes by a string or RegExp matching their name. */
  matchNamePattern?: string | RegExp;
  /** Filters classes to only include those that have the specified decorator applied. */
  withDecorator?: string;
  /** Filters classes to only include those extending the specified base class. */
  extending?: string;
  /** Filters classes to only include those implementing the specified interface. */
  implementing?: string;
  /** Filters classes to only include those with the specified AST modifier (e.g., 'export', 'abstract'). */
  havingModifier?: string;
}

import type { ArchestProject } from '@archest/core-rust';
import type { ClassQueryOptions } from '../classes/types';
import type { FileData, ProjectData } from '../dto';
import type { FunctionQueryOptions } from '../functions/types';

export interface FileLocatorData {
  type: 'FileLocator';
  files: FileData[];
  projectData: ProjectData;
  archestProject?: ArchestProject;
}

/**
 * Options to filter files when querying the AST via `getFiles()`.
 */
export interface FileQueryOptions {
  /** Filters files to only include those residing in a specific folder path. */
  inFolder?: string;
  /** Filters files by a string or RegExp matching their file name (excluding extension). */
  matchNamePattern?: string | RegExp;
  /** Filters files to only include those containing a function matching the criteria. */
  hasFunction?: FunctionQueryOptions;
  /** Filters files to only include those containing a class matching the criteria. */
  hasClass?: ClassQueryOptions;
}

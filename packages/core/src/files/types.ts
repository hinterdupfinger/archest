import type { ArchestProject } from '@archest/core-rust';
import type { FileData, ProjectData } from '../dto';

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
}

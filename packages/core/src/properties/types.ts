import type { ProjectData, PropertyData } from '../dto';

export interface PropertyLocatorData {
  type: 'PropertyLocator';
  properties: (PropertyData & { _filePath: string })[];
  projectData: ProjectData;
}

/**
 * Options to filter class properties or interface members when querying the AST via `getProperties()`.
 */
export interface PropertyQueryOptions {
  /** Filters properties to only include those residing in a specific folder path. */
  inFolder?: string;
  /** Filters properties by a string or RegExp matching their name. */
  matchNamePattern?: string | RegExp;
}

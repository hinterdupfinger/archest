import type { ProjectData, PropertyData } from '../dto';
import type { PropertyLocatorData, PropertyQueryOptions } from './types';

export function locateProperties(
  properties: (PropertyData & { _filePath: string })[],
  projectData: ProjectData,
  options?: PropertyQueryOptions,
): PropertyLocatorData {
  let filtered = properties;

  if (options?.inFolder) {
    filtered = filtered.filter((p) => {
      return (
        p._filePath.includes(`/${options.inFolder}/`) ||
        p._filePath.includes(`\\${options.inFolder}\\`)
      );
    });
  }

  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((p) => {
      return regex.test(p.name);
    });
  }

  return {
    type: 'PropertyLocator',
    properties: filtered,
    projectData,
  };
}

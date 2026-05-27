import type { ProjectData, PropertyData } from '../dto';
import { getCommonPrefix, isFileInFolder } from '../utils/paths';
import type { PropertyLocatorData, PropertyQueryOptions } from './types';

export function locateProperties(
  properties: (PropertyData & { _filePath: string })[],
  projectData: ProjectData,
  options?: PropertyQueryOptions,
): PropertyLocatorData {
  let filtered = properties;

  if (options?.inFolder) {
    const filePaths = properties.map((p) => p._filePath);
    const projectRoot = projectData.projectRoot || getCommonPrefix(filePaths);
    filtered = filtered.filter((p) =>
      // biome-ignore lint/style/noNonNullAssertion: options.inFolder is checked in the outer if block
      isFileInFolder(p._filePath, projectRoot, options.inFolder!),
    );
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

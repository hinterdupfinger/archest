import type { FunctionData, ProjectData } from '../dto';
import { getCommonPrefix, isFileInFolder } from '../utils/paths';
import type { FunctionLocatorData, FunctionQueryOptions } from './types';

export function locateFunctions(
  functions: (FunctionData & { _filePath: string })[],
  projectData: ProjectData,
  options?: FunctionQueryOptions,
): FunctionLocatorData {
  let filtered = functions;

  if (options?.inFolder) {
    const filePaths = functions.map((f) => f._filePath);
    const projectRoot = projectData.projectRoot || getCommonPrefix(filePaths);
    filtered = filtered.filter((f) =>
      // biome-ignore lint/style/noNonNullAssertion: options.inFolder is checked in the outer if block
      isFileInFolder(f._filePath, projectRoot, options.inFolder!),
    );
  }

  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((f) => {
      return f.name && regex.test(f.name);
    });
  }

  if (options?.isTopLevel) {
    filtered = filtered.filter((f) => f.is_top_level);
  }

  return {
    type: 'FunctionLocator',
    functions: filtered,
    projectData,
  };
}

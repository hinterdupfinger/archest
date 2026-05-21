import type { FunctionData, ProjectData } from '../dto';
import type { FunctionLocatorData, FunctionQueryOptions } from './types';

export function locateFunctions(
  functions: (FunctionData & { _filePath: string })[],
  projectData: ProjectData,
  options?: FunctionQueryOptions,
): FunctionLocatorData {
  let filtered = functions;

  if (options?.inFolder) {
    filtered = filtered.filter((f) => {
      return (
        f._filePath.includes(`/${options.inFolder}/`) ||
        f._filePath.includes(`\\${options.inFolder}\\`)
      );
    });
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

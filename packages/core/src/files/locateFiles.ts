import type { ArchestProject } from '@archest/core-rust';
import type { FileData, ProjectData } from '../dto';
import type { FileLocatorData, FileQueryOptions } from './types';

export function locateFiles(
  sourceFiles: FileData[],
  projectData: ProjectData,
  archestProject?: ArchestProject,
  options?: FileQueryOptions,
): FileLocatorData {
  let filtered = sourceFiles;

  if (options?.inFolder) {
    filtered = filtered.filter(
      (file) =>
        file.path.includes(`/${options.inFolder}/`) ||
        file.path.includes(`\\${options.inFolder}\\`),
    );
  }
  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((file) => regex.test(file.path));
  }

  const result: FileLocatorData = {
    type: 'FileLocator',
    files: filtered,
    projectData,
  };

  if (archestProject) {
    Object.defineProperty(result, 'archestProject', {
      value: archestProject,
      enumerable: false,
    });
  }

  return result;
}

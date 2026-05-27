import type { ArchestProject } from '@archest/core-rust';
import { locateClasses } from '../classes/locateClasses';
import type { FileData, ProjectData } from '../dto';
import { locateFunctions } from '../functions/locateFunctions';
import { getCommonPrefix, isFileInFolder } from '../utils/paths';
import type { FileLocatorData, FileQueryOptions } from './types';

export function locateFiles(
  sourceFiles: FileData[],
  projectData: ProjectData,
  archestProject?: ArchestProject,
  options?: FileQueryOptions,
): FileLocatorData {
  let filtered = sourceFiles;

  if (options?.inFolder) {
    const filePaths = sourceFiles.map((f) => f.path);
    const projectRoot = projectData.projectRoot || getCommonPrefix(filePaths);
    filtered = filtered.filter((file) =>
      // biome-ignore lint/style/noNonNullAssertion: options.inFolder is checked in the outer if block
      isFileInFolder(file.path, projectRoot, options.inFolder!),
    );
  }
  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((file) => regex.test(file.path));
  }
  if (options?.hasFunction) {
    const fnOptions = options.hasFunction;
    filtered = filtered.filter((file) => {
      const fileFns = (file.functions || []).map((fn) => ({
        ...fn,
        _filePath: file.path,
      }));
      const matchedFns = locateFunctions(fileFns, projectData, fnOptions);
      return matchedFns.functions.length > 0;
    });
  }
  if (options?.hasClass) {
    const clOptions = options.hasClass;
    filtered = filtered.filter((file) => {
      const fileClasses = (file.classes || []).map((c) => ({
        ...c,
        _filePath: file.path,
      }));
      const matchedClasses = locateClasses(fileClasses, projectData, clOptions);
      return matchedClasses.classes.length > 0;
    });
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

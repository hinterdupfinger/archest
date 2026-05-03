import type * as ts from 'typescript';
import type { FileLocatorData, FileQueryOptions } from './types';

export function locateFiles(
  sourceFiles: ts.SourceFile[],
  program: ts.Program,
  options?: FileQueryOptions,
): FileLocatorData {
  let filtered = sourceFiles;

  if (options?.inFolder) {
    filtered = filtered.filter(
      (file) =>
        file.fileName.includes(`/${options.inFolder}/`) ||
        file.fileName.includes(`\\${options.inFolder}\\`),
    );
  }
  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((file) => regex.test(file.fileName));
  }

  return {
    type: 'FileLocator',
    files: filtered,
    program,
  };
}

import * as ts from 'typescript';
import type { FunctionLocatorData, FunctionQueryOptions } from './types';

export function locateFunctions(
  functions: ts.FunctionLikeDeclaration[],
  program: ts.Program,
  options?: FunctionQueryOptions,
): FunctionLocatorData {
  let filtered = functions;

  if (options?.inFolder) {
    filtered = filtered.filter((f) => {
      const sourceFile = f.getSourceFile
        ? f.getSourceFile()
        : f.parent
          ? ts.getSourceFileOfNode(f)
          : undefined;
      if (!sourceFile) return false;
      return (
        sourceFile.fileName.includes(`/${options.inFolder}/`) ||
        sourceFile.fileName.includes(`\\${options.inFolder}\\`)
      );
    });
  }

  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((f) => {
      return f.name && ts.isIdentifier(f.name) && regex.test(f.name.text);
    });
  }

  if (options?.isTopLevel) {
    filtered = filtered.filter((f) => {
      return ts.isSourceFile(f.parent);
    });
  }

  return {
    type: 'FunctionLocator',
    functions: filtered,
    program,
  };
}

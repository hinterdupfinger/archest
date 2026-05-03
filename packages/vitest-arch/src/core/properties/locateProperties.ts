import * as ts from 'typescript';
import type { PropertyLocatorData, PropertyQueryOptions } from './types';

export function locateProperties(
  properties: ts.PropertyDeclaration[],
  program: ts.Program,
  options?: PropertyQueryOptions,
): PropertyLocatorData {
  let filtered = properties;

  if (options?.inFolder) {
    filtered = filtered.filter((p) => {
      const sourceFile = p.getSourceFile
        ? p.getSourceFile()
        : p.parent
          ? ts.getSourceFileOfNode(p)
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
    filtered = filtered.filter((p) => {
      return ts.isIdentifier(p.name) && regex.test(p.name.text);
    });
  }

  return {
    type: 'PropertyLocator',
    properties: filtered,
    program,
  };
}

import type * as ts from 'typescript';
import type { LayeredArchitectureData } from './types';

export function createLayeredArchitecture(
  files: ts.SourceFile[],
  program: ts.Program,
): LayeredArchitectureData {
  return {
    type: 'LayeredArchitecture',
    files,
    layers: new Map<string, string>(),
    assertions: [],
    program,
  };
}

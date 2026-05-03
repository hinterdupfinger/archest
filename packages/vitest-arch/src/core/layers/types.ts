import type * as ts from 'typescript';

export interface LayeredArchitectureData {
  type: 'LayeredArchitecture';
  files: ts.SourceFile[];
  layers: Map<string, string>;
  assertions: Array<(files: ts.SourceFile[]) => string[]>;
  program: ts.Program;
}

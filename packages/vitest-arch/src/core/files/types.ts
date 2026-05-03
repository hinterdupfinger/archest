import type * as ts from 'typescript';

export interface FileLocatorData {
  type: 'FileLocator';
  files: ts.SourceFile[];
  program: ts.Program;
}

export interface FileQueryOptions {
  inFolder?: string;
  matchNamePattern?: string | RegExp;
}

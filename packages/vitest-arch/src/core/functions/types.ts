import type * as ts from 'typescript';

export interface FunctionLocatorData {
  type: 'FunctionLocator';
  functions: ts.FunctionLikeDeclaration[];
  program: ts.Program;
}

export interface FunctionQueryOptions {
  inFolder?: string;
  matchNamePattern?: string | RegExp;
  isTopLevel?: boolean;
}

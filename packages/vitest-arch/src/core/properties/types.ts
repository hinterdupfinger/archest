import type * as ts from 'typescript';

export interface PropertyLocatorData {
  type: 'PropertyLocator';
  properties: ts.PropertyDeclaration[];
  program: ts.Program;
}

export interface PropertyQueryOptions {
  inFolder?: string;
  matchNamePattern?: string | RegExp;
}

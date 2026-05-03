import type * as ts from 'typescript';

export interface ClassLocatorData {
  type: 'ClassLocator';
  classes: ts.ClassDeclaration[];
  program: ts.Program;
}

export interface ClassQueryOptions {
  inFolder?: string;
  matchNamePattern?: string | RegExp;
  withDecorator?: string;
  extending?: string;
  implementing?: string;
  havingModifier?: string;
}

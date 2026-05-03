import type * as ts from 'typescript';

export interface SliceLocatorData {
  type: 'SliceLocator';
  slicePattern: RegExp;
  sliceIds: Set<string>;
  sliceFiles: Map<string, ts.SourceFile[]>;
  program: ts.Program;
}

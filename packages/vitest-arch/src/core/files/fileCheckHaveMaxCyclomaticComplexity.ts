import * as ts from 'typescript';
import { calculateCyclomaticComplexity } from '../metrics/calculateCyclomaticComplexity';
import { sharedCheckHaveMaxCyclomaticComplexity } from '../shared/sharedCheckHaveMaxCyclomaticComplexity';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckHaveMaxCyclomaticComplexity(
  locator: FileLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMaxCyclomaticComplexity(
    locator.files,
    (f) => f.fileName,
    (file) => {
      let complexity = 0;
      const visit = (node: ts.Node) => {
        if (
          ts.isFunctionDeclaration(node) ||
          ts.isMethodDeclaration(node) ||
          ts.isArrowFunction(node) ||
          ts.isFunctionExpression(node)
        ) {
          complexity += calculateCyclomaticComplexity(node);
        }
        ts.forEachChild(node, visit);
      };
      visit(file);
      return complexity;
    },
    'File',
    max,
    isNot,
  );
}

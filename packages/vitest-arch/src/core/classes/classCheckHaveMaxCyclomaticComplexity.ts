import * as ts from 'typescript';
import { calculateCyclomaticComplexity } from '../metrics/calculateCyclomaticComplexity';
import { sharedCheckHaveMaxCyclomaticComplexity } from '../shared/sharedCheckHaveMaxCyclomaticComplexity';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckHaveMaxCyclomaticComplexity(
  locator: ClassLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMaxCyclomaticComplexity(
    locator.classes,
    (c) => c.name?.text,
    (c) => {
      let complexity = 0;
      const visit = (node: ts.Node) => {
        if (
          ts.isMethodDeclaration(node) ||
          ts.isConstructorDeclaration(node) ||
          ts.isGetAccessor(node) ||
          ts.isSetAccessor(node)
        ) {
          complexity += calculateCyclomaticComplexity(node);
        }
        ts.forEachChild(node, visit);
      };
      visit(c);
      return complexity;
    },
    'Class',
    max,
    isNot,
  );
}

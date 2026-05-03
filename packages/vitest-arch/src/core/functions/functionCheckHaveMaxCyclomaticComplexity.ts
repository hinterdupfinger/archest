import * as ts from 'typescript';
import { calculateCyclomaticComplexity } from '../metrics/calculateCyclomaticComplexity';
import { sharedCheckHaveMaxCyclomaticComplexity } from '../shared/sharedCheckHaveMaxCyclomaticComplexity';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveMaxCyclomaticComplexity(
  locator: FunctionLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMaxCyclomaticComplexity(
    locator.functions,
    (f) => (f.name && ts.isIdentifier(f.name) ? f.name.text : undefined),
    calculateCyclomaticComplexity,
    'Function',
    max,
    isNot,
  );
}

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
    (f) => f.name,
    (f) => f.cyclomatic_complexity || 0,
    'Function',
    max,
    isNot,
  );
}

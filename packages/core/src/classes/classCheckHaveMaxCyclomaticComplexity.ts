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
    (c) => c.name,
    (c) => c.cyclomatic_complexity || 0,
    'Class',
    max,
    isNot,
  );
}

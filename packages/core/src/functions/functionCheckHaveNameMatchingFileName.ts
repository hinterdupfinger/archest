import { sharedCheckHaveNameMatchingFileName } from '../shared/sharedCheckHaveNameMatchingFileName';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveNameMatchingFileName(
  locator: FunctionLocatorData,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveNameMatchingFileName(
    locator.functions,
    (f) => f.name,
    'Function',
    isNot,
  );
}

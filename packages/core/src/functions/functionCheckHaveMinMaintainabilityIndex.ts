import { sharedCheckHaveMinMaintainabilityIndex } from '../shared/sharedCheckHaveMinMaintainabilityIndex';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveMinMaintainabilityIndex(
  locator: FunctionLocatorData,
  min: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMinMaintainabilityIndex(
    locator.functions,
    (f) => f.name,
    (f) => f.maintainability_index || 100,
    'Function',
    min,
    isNot,
  );
}

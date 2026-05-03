import * as ts from 'typescript';
import { calculateMaintainabilityIndex } from '../metrics/calculateMaintainabilityIndex';
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
    (f) => (f.name && ts.isIdentifier(f.name) ? f.name.text : undefined),
    calculateMaintainabilityIndex,
    'Function',
    min,
    isNot,
  );
}

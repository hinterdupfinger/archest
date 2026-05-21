import { sharedCheckHaveModifier } from '../shared/sharedCheckHaveModifier';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckHaveModifier(
  locator: ClassLocatorData,
  modifierStr: string,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveModifier(
    locator.classes,
    (c) => c.name,
    'Class',
    modifierStr,
    isNot,
  );
}

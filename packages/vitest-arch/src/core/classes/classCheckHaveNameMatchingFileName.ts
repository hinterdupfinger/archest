import { sharedCheckHaveNameMatchingFileName } from '../shared/sharedCheckHaveNameMatchingFileName';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckHaveNameMatchingFileName(
  locator: ClassLocatorData,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveNameMatchingFileName(
    locator.classes,
    (c) => c.name?.text,
    'Class',
    isNot,
  );
}

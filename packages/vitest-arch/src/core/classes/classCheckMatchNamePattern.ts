import { sharedCheckMatchNamePattern } from '../shared/sharedCheckMatchNamePattern';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckMatchNamePattern(
  locator: ClassLocatorData,
  pattern: string | RegExp,
  isNot: boolean,
): RuleResult {
  return sharedCheckMatchNamePattern(
    locator.classes,
    (c) => c.name?.text,
    'Class',
    pattern,
    isNot,
  );
}

import { sharedCheckMatchNamePattern } from '../shared/sharedCheckMatchNamePattern';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckMatchNamePattern(
  locator: FileLocatorData,
  pattern: string | RegExp,
  isNot: boolean,
): RuleResult {
  return sharedCheckMatchNamePattern(
    locator.files,
    (f) => f.fileName,
    'File',
    pattern,
    isNot,
  );
}

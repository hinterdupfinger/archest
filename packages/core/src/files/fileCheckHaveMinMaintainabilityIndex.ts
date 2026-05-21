import { sharedCheckHaveMinMaintainabilityIndex } from '../shared/sharedCheckHaveMinMaintainabilityIndex';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckHaveMinMaintainabilityIndex(
  locator: FileLocatorData,
  min: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMinMaintainabilityIndex(
    locator.files,
    (f) => f.path,
    (file) => {
      if (file.functions.length > 0) {
        return file.functions[0].maintainability_index || 100;
      }
      return 100;
    },
    'File',
    min,
    isNot,
  );
}

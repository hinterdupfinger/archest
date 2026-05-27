import { sharedCheckHaveMinMaintainabilityIndex } from '../shared/sharedCheckHaveMinMaintainabilityIndex';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckHaveMinMaintainabilityIndex(
  locator: FileLocatorData,
  min: number,
  isNot: boolean,
): RuleResult {
  if (locator.files.length === 0) {
    return {
      pass: false,
      message: () => 'No files matched the selector. The rule is vacuous.',
    };
  }

  return sharedCheckHaveMinMaintainabilityIndex(
    locator.files,
    (f) => f.path,
    (file) => {
      const items = [...(file.functions || []), ...(file.classes || [])];
      if (items.length > 0) {
        const sum = items.reduce(
          (acc, item) => acc + (item.maintainability_index || 0),
          0,
        );
        return Math.round(sum / items.length);
      }
      return 100;
    },
    'File',
    min,
    isNot,
  );
}

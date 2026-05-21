import { sharedCheckHaveMaxCyclomaticComplexity } from '../shared/sharedCheckHaveMaxCyclomaticComplexity';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckHaveMaxCyclomaticComplexity(
  locator: FileLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveMaxCyclomaticComplexity(
    locator.files,
    (f) => f.path,
    (file) => {
      let complexity = 0;
      for (const func of file.functions) {
        complexity += func.cyclomatic_complexity || 0;
      }
      for (const cls of file.classes) {
        complexity += cls.cyclomatic_complexity || 0;
      }
      return complexity;
    },
    'File',
    max,
    isNot,
  );
}

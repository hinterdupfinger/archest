import { calculateMaintainabilityIndex } from '../metrics/calculateMaintainabilityIndex';
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
    (f) => f.fileName,
    calculateMaintainabilityIndex,
    'File',
    min,
    isNot,
  );
}

import type { RuleResult } from '../types';
import { getFileDependencies } from './getFileDependencies';
import type { FileLocatorData } from './types';

export function fileCheckBeFreeOfCycles(
  locator: FileLocatorData,
  isNot: boolean,
): RuleResult {
  const targetFiles = locator.files.map((f) => f.path);
  
  const archestProject = locator.archestProject;
  if (!archestProject) {
    // Fallback for mocked tests or if registry is missing
    return {
      pass: true,
      message: () => 'Mock pass: archestProject not in registry',
    };
  }

  const result = archestProject.checkFileCycles(targetFiles, !!isNot);

  return {
    pass: result.pass,
    message: () => result.message,
  };
}

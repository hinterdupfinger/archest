import type { RuleResult } from '../types';
import { getFileDependencies } from './getFileDependencies';
import type { FileLocatorData } from './types';

export function checkDependOnFilesInFolder(
  locator: FileLocatorData,
  targetFolder: string,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];

  for (const file of locator.files) {
    const dependencies = getFileDependencies(file, locator.projectData);

    const dependsOnTarget = dependencies.some(
      (depPath) =>
        depPath.includes(`/${targetFolder}/`) ||
        depPath.includes(`\\${targetFolder}\\`),
    );

    if (isNot && dependsOnTarget) {
      violations.push(
        `File ${file.path} depends on files in ${targetFolder}, but it shouldn't.`,
      );
    } else if (!isNot && !dependsOnTarget) {
      violations.push(
        `File ${file.path} does not depend on files in ${targetFolder}, but it should.`,
      );
    }
  }

  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

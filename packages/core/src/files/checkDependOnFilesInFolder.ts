import type { RuleResult } from '../types';
import { hasPathSegment } from '../utils/paths';
import { getFileDependencies } from './getFileDependencies';
import type { FileLocatorData } from './types';

export function checkDependOnFilesInFolder(
  locator: FileLocatorData,
  targetFolder: string,
  isNot: boolean,
): RuleResult {
  if (locator.files.length === 0) {
    return {
      pass: false,
      message: () => 'No files matched the selector. The rule is vacuous.',
    };
  }

  const violations: string[] = [];

  for (const file of locator.files) {
    const dependencies = getFileDependencies(file, locator.projectData);

    const dependsOnTarget = dependencies.some((depPath) =>
      hasPathSegment(depPath, targetFolder),
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

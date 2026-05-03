import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckResideInFolder(
  locator: ClassLocatorData,
  targetFolder: string,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const c of locator.classes) {
    const className = c.name?.text || 'Anonymous Class';
    const sourceFile = c.getSourceFile();
    const inTargetFolder =
      sourceFile.fileName.includes(`/${targetFolder}/`) ||
      sourceFile.fileName.includes(`\\${targetFolder}\\`);

    if (isNot && inTargetFolder) {
      violations.push(
        `Class ${className} resides in ${targetFolder}, but it shouldn't.`,
      );
    } else if (!isNot && !inTargetFolder) {
      violations.push(
        `Class ${className} does not reside in ${targetFolder}, but it should.`,
      );
    }
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

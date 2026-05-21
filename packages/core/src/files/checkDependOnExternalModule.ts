import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function checkDependOnExternalModule(
  locator: FileLocatorData,
  moduleName: string | RegExp,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];

  const regex =
    typeof moduleName === 'string' ? new RegExp(moduleName) : moduleName;

  for (const file of locator.files) {
    const deps = file.external_dependencies || [];
    const dependsOnModule = deps.some((dep) => regex.test(dep));

    if (isNot && dependsOnModule) {
      violations.push(
        `${file.path} incorrectly depends on external module '${moduleName}'`,
      );
    } else if (!isNot && !dependsOnModule) {
      violations.push(
        `${file.path} does not depend on external module '${moduleName}'`,
      );
    }
  }

  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

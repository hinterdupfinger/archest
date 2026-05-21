import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckImplementInterface(
  locator: ClassLocatorData,
  interfaceName: string,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const c of locator.classes) {
    const name = c.name || 'Anonymous';
    let matches = false;
    if (c.implements.includes(interfaceName)) {
      matches = true;
    }
    if (isNot && matches) {
      violations.push(
        `Class ${name} implements ${interfaceName}, but it shouldn't.`,
      );
    } else if (!isNot && !matches) {
      violations.push(
        `Class ${name} does not implement ${interfaceName}, but it should.`,
      );
    }
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

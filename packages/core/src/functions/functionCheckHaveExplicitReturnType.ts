import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveExplicitReturnType(
  locator: FunctionLocatorData,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const f of locator.functions) {
    const name = f.name || 'Anonymous Function';
    const hasType = f.has_explicit_return_type;

    if (isNot && hasType) {
      violations.push(
        `Function ${name} has an explicit return type, but it shouldn't.`,
      );
    } else if (!isNot && !hasType) {
      violations.push(
        `Function ${name} does not have an explicit return type, but it should.`,
      );
    }
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

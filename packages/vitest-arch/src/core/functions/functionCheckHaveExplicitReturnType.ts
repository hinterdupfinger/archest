import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveExplicitReturnType(
  locator: FunctionLocatorData,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const f of locator.functions) {
    const name =
      f.name && ts.isIdentifier(f.name) ? f.name.text : 'Anonymous Function';
    const hasType = !!f.type;

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

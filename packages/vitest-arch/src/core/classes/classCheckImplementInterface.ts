import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckImplementInterface(
  locator: ClassLocatorData,
  interfaceName: string,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const c of locator.classes) {
    const name = c.name?.text || 'Anonymous';
    let matches = false;
    if (c.heritageClauses) {
      for (const clause of c.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
          for (const type of clause.types) {
            if (
              ts.isIdentifier(type.expression) &&
              type.expression.text === interfaceName
            ) {
              matches = true;
              break;
            }
          }
        }
      }
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

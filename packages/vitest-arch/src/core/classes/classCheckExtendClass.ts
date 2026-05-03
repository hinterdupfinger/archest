import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { ClassLocatorData } from './types';

export function classCheckExtendClass(
  locator: ClassLocatorData,
  className: string,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const c of locator.classes) {
    const name = c.name?.text || 'Anonymous';
    let matches = false;
    if (c.heritageClauses) {
      for (const clause of c.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
          for (const type of clause.types) {
            if (
              ts.isIdentifier(type.expression) &&
              type.expression.text === className
            ) {
              matches = true;
              break;
            }
          }
        }
      }
    }
    if (isNot && matches) {
      violations.push(`Class ${name} extends ${className}, but it shouldn't.`);
    } else if (!isNot && !matches) {
      violations.push(
        `Class ${name} does not extend ${className}, but it should.`,
      );
    }
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

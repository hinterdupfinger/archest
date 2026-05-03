import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { PropertyLocatorData } from './types';

export function propertyCheckBeReadonly(
  locator: PropertyLocatorData,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const p of locator.properties) {
    const name = ts.isIdentifier(p.name) ? p.name.text : 'Anonymous Property';
    const modifiers = ts.canHaveModifiers(p) ? ts.getModifiers(p) : undefined;
    const matches = modifiers?.some(
      (m: ts.Modifier) => m.kind === ts.SyntaxKind.ReadonlyKeyword,
    );

    if (isNot && matches) {
      violations.push(`Property ${name} is readonly, but it shouldn't be.`);
    } else if (!isNot && !matches) {
      violations.push(`Property ${name} is not readonly, but it should be.`);
    }
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

import * as ts from 'typescript';
import { buildRule } from '../utils/ruleBuilder';

export function sharedCheckHaveModifier<T extends ts.Node>(
  items: T[],
  getName: (item: T) => string | undefined,
  label: string,
  modifierStr: string,
  isNot: boolean,
) {
  let targetKind: ts.SyntaxKind;
  switch (modifierStr) {
    case 'export':
      targetKind = ts.SyntaxKind.ExportKeyword;
      break;
    case 'default':
      targetKind = ts.SyntaxKind.DefaultKeyword;
      break;
    case 'abstract':
      targetKind = ts.SyntaxKind.AbstractKeyword;
      break;
    default:
      throw new Error(`Modifier ${modifierStr} is not fully supported.`);
  }

  return buildRule(items, isNot, (item) => {
    const name = getName(item);
    const modifiers = ts.canHaveModifiers(item)
      ? ts.getModifiers(item)
      : undefined;
    const passes = modifiers
      ? modifiers.some((m: ts.Modifier) => m.kind === targetKind)
      : false;
    const desc = `${label} ${name || 'Anonymous'}`;

    return {
      passes,
      failMessage: `${desc} does not have modifier ${modifierStr}, but it should.`,
      failNotMessage: `${desc} has modifier ${modifierStr}, but it shouldn't.`,
    };
  });
}

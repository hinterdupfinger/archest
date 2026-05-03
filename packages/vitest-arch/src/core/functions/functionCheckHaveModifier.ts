import * as ts from 'typescript';
import { sharedCheckHaveModifier } from '../shared/sharedCheckHaveModifier';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckHaveModifier(
  locator: FunctionLocatorData,
  modifierStr: string,
  isNot: boolean,
): RuleResult {
  return sharedCheckHaveModifier(
    locator.functions,
    (f) => (f.name && ts.isIdentifier(f.name) ? f.name.text : undefined),
    'Function',
    modifierStr,
    isNot,
  );
}

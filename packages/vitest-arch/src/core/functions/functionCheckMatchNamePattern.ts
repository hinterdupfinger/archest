import * as ts from 'typescript';
import { sharedCheckMatchNamePattern } from '../shared/sharedCheckMatchNamePattern';
import type { RuleResult } from '../types';
import type { FunctionLocatorData } from './types';

export function functionCheckMatchNamePattern(
  locator: FunctionLocatorData,
  pattern: string | RegExp,
  isNot: boolean,
): RuleResult {
  return sharedCheckMatchNamePattern(
    locator.functions,
    (f) => (f.name && ts.isIdentifier(f.name) ? f.name.text : undefined),
    'Function',
    pattern,
    isNot,
  );
}

import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { FileLocatorData } from './types';

export function fileCheckHaveMaxExportedFunctions(
  locator: FileLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  for (const file of locator.files) {
    let exportedFuncCount = 0;

    ts.forEachChild(file, (node) => {
      if (ts.isFunctionDeclaration(node)) {
        const modifiers = ts.canHaveModifiers(node)
          ? ts.getModifiers(node)
          : undefined;
        if (modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          exportedFuncCount++;
        }
      }
    });

    const exceeds = exportedFuncCount > max;

    if (isNot && exceeds) {
      violations.push(
        `File ${file.fileName} has ${exportedFuncCount} exported functions, which exceeds the maximum of ${max}, but it shouldn't.`,
      );
    } else if (!isNot && exceeds) {
      violations.push(
        `File ${file.fileName} has ${exportedFuncCount} exported functions, which exceeds the maximum of ${max}.`,
      );
    }
  }
  return {
    pass: isNot ? violations.length > 0 : violations.length === 0,
    message: () =>
      violations.join('\n') ||
      (isNot
        ? 'Expected some files to exceed maximum exported functions, but none did.'
        : ''),
  };
}

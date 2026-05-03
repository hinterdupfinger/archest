import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { SliceLocatorData } from './types';

export function sliceCheckHaveMaxDistanceFromMainSequence(
  locator: SliceLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];

  const ceMap = new Map<string, Set<string>>(); // Slices this slice depends on
  const caMap = new Map<string, Set<string>>(); // Slices depending on this slice

  for (const slice of locator.sliceIds) {
    ceMap.set(slice, new Set());
    caMap.set(slice, new Set());
  }

  for (const [sliceId, files] of locator.sliceFiles.entries()) {
    for (const sf of files) {
      ts.forEachChild(sf, (node) => {
        if (
          ts.isImportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const importPath = node.moduleSpecifier.text;
          const resolved = ts.resolveModuleName(
            importPath,
            sf.fileName,
            locator.program.getCompilerOptions(),
            ts.sys,
          );
          if (resolved.resolvedModule?.resolvedFileName) {
            const targetMatch = resolved.resolvedModule.resolvedFileName.match(
              locator.slicePattern,
            );
            if (targetMatch?.[1]) {
              const targetSlice = targetMatch[1];
              if (
                targetSlice !== sliceId &&
                locator.sliceIds.has(targetSlice)
              ) {
                ceMap.get(sliceId)?.add(targetSlice);
                caMap.get(targetSlice)?.add(sliceId);
              }
            }
          }
        }
      });
    }
  }

  for (const sliceId of locator.sliceIds) {
    const ce = ceMap.get(sliceId)?.size;
    const ca = caMap.get(sliceId)?.size;

    // biome-ignore lint/style/noNonNullAssertion: Safe map lookup
    const files = locator.sliceFiles.get(sliceId)!;
    let na = 0; // abstract classes + interfaces
    let nc = 0; // all classes + interfaces

    for (const sf of files) {
      const visit = (node: ts.Node) => {
        if (ts.isClassDeclaration(node)) {
          nc++;
          const modifiers = ts.canHaveModifiers(node)
            ? ts.getModifiers(node)
            : undefined;
          if (
            modifiers?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword)
          ) {
            na++;
          }
        } else if (ts.isInterfaceDeclaration(node)) {
          nc++;
          na++;
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }

    const I = ce + ca === 0 ? 0 : ce / (ca + ce);
    const A = nc === 0 ? 0 : na / nc;

    const D = Math.abs(A + I - 1);
    const exceeds = D > max;

    if (isNot && exceeds) {
      violations.push(
        `Slice ${sliceId} has a Distance from the Main Sequence of ${D.toFixed(2)}, which exceeds the maximum of ${max}, but it shouldn't.`,
      );
    } else if (!isNot && exceeds) {
      violations.push(
        `Slice ${sliceId} has a Distance from the Main Sequence of ${D.toFixed(2)}, which exceeds the maximum of ${max}.`,
      );
    }
  }

  return {
    pass: isNot ? violations.length > 0 : violations.length === 0,
    message: () =>
      violations.join('\n') ||
      (isNot
        ? 'Expected some slices to exceed maximum distance from main sequence, but none did.'
        : ''),
  };
}

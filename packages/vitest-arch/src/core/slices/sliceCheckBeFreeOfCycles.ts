import * as ts from 'typescript';
import type { RuleResult } from '../types';
import type { SliceLocatorData } from './types';

export function sliceCheckBeFreeOfCycles(
  locator: SliceLocatorData,
  isNot: boolean,
): RuleResult {
  const graph: Map<string, Set<string>> = new Map();
  for (const slice of locator.sliceIds) {
    graph.set(slice, new Set());
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
                graph.get(sliceId)?.add(targetSlice);
              }
            }
          }
        }
      });
    }
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const violations: string[] = [];

  const dfs = (node: string, path: string[]): boolean => {
    visited.add(node);
    recursionStack.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, [...path, neighbor])) return true;
      } else if (recursionStack.has(neighbor)) {
        violations.push(
          `Cycle detected between slices: ${path.join(' -> ')} -> ${neighbor}`,
        );
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  };

  for (const slice of locator.sliceIds) {
    if (!visited.has(slice)) {
      dfs(slice, [slice]);
    }
  }

  if (isNot) {
    return {
      pass: violations.length > 0,
      message: () =>
        violations.length > 0
          ? ''
          : 'Expected cycles between slices but found none.',
    };
  } else {
    return {
      pass: violations.length === 0,
      message: () => violations.join('\n'),
    };
  }
}

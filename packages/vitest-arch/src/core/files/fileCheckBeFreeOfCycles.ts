import type { RuleResult } from '../types';
import { getFileDependencies } from './getFileDependencies';
import type { FileLocatorData } from './types';

export function fileCheckBeFreeOfCycles(
  locator: FileLocatorData,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];
  const targetedFilePaths = new Set<string>(
    locator.files.map((f) => f.fileName),
  );
  const graph = new Map<string, string[]>();

  for (const file of locator.files) {
    const filePath = file.fileName;
    const dependencies = getFileDependencies(file, locator.program).filter(
      (p) => targetedFilePaths.has(p),
    );

    graph.set(filePath, dependencies);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const cycles: string[][] = [];

  const isCyclicUtil = (node: string, path: string[]) => {
    if (recStack.has(node)) {
      const cycleStartIndex = path.indexOf(node);
      const cycleStr = [...path.slice(cycleStartIndex), node].join('->');
      if (!cycles.some((c) => c.join('->') === cycleStr)) {
        cycles.push([...path.slice(cycleStartIndex), node]);
      }
      return true;
    }

    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      isCyclicUtil(neighbor, path);
    }

    recStack.delete(node);
    path.pop();
    return false;
  };

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      isCyclicUtil(node, []);
    }
  }

  if (isNot && cycles.length === 0) {
    violations.push('Expected cyclic dependencies, but found none.');
  } else if (!isNot && cycles.length > 0) {
    for (const cycle of cycles) {
      violations.push(`Cycle detected: ${cycle.join(' -> ')}`);
    }
  }

  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

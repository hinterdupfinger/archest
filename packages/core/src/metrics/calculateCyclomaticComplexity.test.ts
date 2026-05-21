import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { calculateCyclomaticComplexity } from './calculateCyclomaticComplexity';

function getTSFunctions(sourceFile: ts.SourceFile): ts.Node[] {
  const fns: ts.Node[] = [];
  ts.forEachChild(sourceFile, (n) => {
    if (ts.isFunctionDeclaration(n)) fns.push(n);
  });
  return fns;
}

describe('calculateCyclomaticComplexity', () => {
  it('should return 1 for a simple function', () => {
    const sourceFile = createSourceFile('function simple() { return 1; }');
    const fns = getTSFunctions(sourceFile);
    expect(calculateCyclomaticComplexity(fns[0])).toBe(1);
  });

  it('should calculate higher complexity for branches', () => {
    const sourceFile = createSourceFile(`
      function complex(a) {
        if (a) return 1;
        if (!a) return 2;
        return a ? 3 : 4;
      }
    `);
    const fns = getTSFunctions(sourceFile);
    expect(calculateCyclomaticComplexity(fns[0])).toBe(4);
  });
});

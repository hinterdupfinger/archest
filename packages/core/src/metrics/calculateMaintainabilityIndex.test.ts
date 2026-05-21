import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { calculateMaintainabilityIndex } from './calculateMaintainabilityIndex';

function getTSFunctions(sourceFile: ts.SourceFile): ts.Node[] {
  const fns: ts.Node[] = [];
  ts.forEachChild(sourceFile, (n) => {
    if (ts.isFunctionDeclaration(n)) fns.push(n);
  });
  return fns;
}

describe('calculateMaintainabilityIndex', () => {
  it('should return a high index for a simple function', () => {
    const sourceFile = createSourceFile('function simple() { return 1; }');
    const fns = getTSFunctions(sourceFile);
    expect(calculateMaintainabilityIndex(fns[0])).toBeGreaterThan(80);
  });

  it('should return a lower index for a complex function', () => {
    const sourceFile = createSourceFile(`
      function complex(a, b, c) {
        if (a) {
          if (b) {
            for (let i = 0; i < 10; i++) {
               console.log(c);
            }
          }
        }
        switch(a) {
          case 1: return 1;
          case 2: return 2;
        }
      }
    `);
    const fns = getTSFunctions(sourceFile);
    const complexMI = calculateMaintainabilityIndex(fns[0]);
    const simpleSourceFile = createSourceFile(
      'function simple() { return 1; }',
    );
    const simpleMI = calculateMaintainabilityIndex(
      getTSFunctions(simpleSourceFile)[0],
    );
    expect(complexMI).toBeLessThan(simpleMI);
  });
});

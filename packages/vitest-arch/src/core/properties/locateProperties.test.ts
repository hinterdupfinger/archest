import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { locateProperties } from './locateProperties';

describe('locateProperties', () => {
  it('should return all properties if no query options', () => {
    const file1 = createSourceFile('class A { prop: string; }');
    const properties: ts.PropertyDeclaration[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertyDeclaration(node)) properties.push(node);
      ts.forEachChild(node, visit);
    };
    visit(file1);
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateProperties(properties, {} as any);
    expect(result.properties.length).toBe(1);
  });
});

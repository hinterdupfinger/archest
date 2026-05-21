import { describe, expect, it } from 'vitest';
import { createSourceFile, getProperties } from '../testUtils';
import { propertyCheckBeReadonly } from './propertyCheckBeReadonly';
import type { PropertyLocatorData } from './types';

describe('propertyCheckBeReadonly', () => {
  it('should pass if properties are readonly', () => {
    const sourceFile = createSourceFile(
      `class MyClass { readonly prop: string; }`,
    );
    const data: PropertyLocatorData = {
      type: 'PropertyLocator',
      properties: getProperties(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = propertyCheckBeReadonly(data, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if properties are not readonly', () => {
    const sourceFile = createSourceFile(`class MyClass { prop: string; }`);
    const data: PropertyLocatorData = {
      type: 'PropertyLocator',
      properties: getProperties(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = propertyCheckBeReadonly(data, false);
    expect(result.pass).toBe(false);
  });
});

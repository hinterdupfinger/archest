import { describe, expect, it } from 'vitest';
import { createSourceFile, getFunctions } from '../testUtils';
import { locateFunctions } from './locateFunctions';

describe('locateFunctions', () => {
  it('should filter functions by matchNamePattern', () => {
    const file1 = createSourceFile('function a() {}; function b() {}');
    const functions = getFunctions(file1);
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateFunctions(functions, {} as any, {
      matchNamePattern: 'a',
    });
    expect(result.functions.length).toBe(1);
    expect(result.functions[0].name?.text).toBe('a');
  });
});

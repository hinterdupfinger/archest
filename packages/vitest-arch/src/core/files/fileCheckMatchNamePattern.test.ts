import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { fileCheckMatchNamePattern } from './fileCheckMatchNamePattern';
import type { FileLocatorData } from './types';

describe('fileCheckMatchNamePattern', () => {
  it('should pass if filename matches', () => {
    const sourceFile = createSourceFile(`// code`, 'src/core/test.ts');
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [sourceFile],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckMatchNamePattern(data, /.*\.ts$/, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if filename does not match', () => {
    const sourceFile = createSourceFile(`// code`, 'src/core/test.js');
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [sourceFile],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckMatchNamePattern(data, /.*\.ts$/, false);
    expect(result.pass).toBe(false);
  });
});

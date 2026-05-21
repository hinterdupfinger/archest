import { describe, expect, it } from 'vitest';

import { fileCheckMatchNamePattern } from './fileCheckMatchNamePattern';
import type { FileLocatorData } from './types';

describe('fileCheckMatchNamePattern', () => {
  it('should pass if filename matches', () => {
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [
        {
          path: 'src/core/test.ts',
          classes: [],
          functions: [],
          properties: [],
          dependencies: [],
        },
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckMatchNamePattern(data, /.*\.ts$/, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if filename does not match', () => {
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [
        {
          path: 'src/core/test.js',
          classes: [],
          functions: [],
          properties: [],
          dependencies: [],
        },
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckMatchNamePattern(data, /.*\.ts$/, false);
    expect(result.pass).toBe(false);
  });
});

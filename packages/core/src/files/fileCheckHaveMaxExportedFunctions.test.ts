import { describe, expect, it } from 'vitest';

import { fileCheckHaveMaxExportedFunctions } from './fileCheckHaveMaxExportedFunctions';
import type { FileLocatorData } from './types';

describe('fileCheckHaveMaxExportedFunctions', () => {
  it('should pass if under max exports', () => {
    const data: FileLocatorData = {
      type: 'FileLocator',
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      files: [{ path: 'test.ts', functions: [{ is_exported: true }] } as any],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      projectData: {} as any,
    };
    const result = fileCheckHaveMaxExportedFunctions(data, 1, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if over max exports', () => {
    const data: FileLocatorData = {
      type: 'FileLocator',
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      files: [
        {
          path: 'test.ts',
          functions: [{ is_exported: true }, { is_exported: true }],
        } as any,
      ],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      projectData: {} as any,
    };
    const result = fileCheckHaveMaxExportedFunctions(data, 1, false);
    expect(result.pass).toBe(false);
  });
});

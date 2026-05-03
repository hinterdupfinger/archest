import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { fileCheckHaveMaxExportedFunctions } from './fileCheckHaveMaxExportedFunctions';
import type { FileLocatorData } from './types';

describe('fileCheckHaveMaxExportedFunctions', () => {
  it('should pass if under max exports', () => {
    const sourceFile = createSourceFile(`export function a() {}`);
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [sourceFile],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckHaveMaxExportedFunctions(data, 1, false);
    expect(result.pass).toBe(true);
  });

  it('should fail if over max exports', () => {
    const sourceFile = createSourceFile(
      `export function a() {} export function b() {}`,
    );
    const data: FileLocatorData = {
      type: 'FileLocator',
      files: [sourceFile],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = fileCheckHaveMaxExportedFunctions(data, 1, false);
    expect(result.pass).toBe(false);
  });
});

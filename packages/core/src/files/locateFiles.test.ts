import { describe, expect, it } from 'vitest';
import { createMockProgram, createSourceFile } from '../testUtils';
import { locateFiles } from './locateFiles';

describe('locateFiles', () => {
  it('should filter files by inFolder query', () => {
    const file1 = createSourceFile('function a() {}', 'src/domain/file1.ts');
    const file2 = createSourceFile('function b() {}', 'src/infra/file2.ts');
    const project = createMockProgram([file1, file2]);
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateFiles(project.files as any, project, undefined, {
      inFolder: 'domain',
    });
    expect(result.files.length).toBe(1);
    expect(result.files[0].path).toBe('src/domain/file1.ts');
  });

  it('should filter files by matchNamePattern query', () => {
    const file1 = createSourceFile('function a() {}', 'src/domain/file1.ts');
    const file2 = createSourceFile(
      'function b() {}',
      'src/domain/file2.spec.ts',
    );
    const project = createMockProgram([file1, file2]);
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateFiles(project.files as any, project, undefined, {
      matchNamePattern: /\.spec\.ts$/,
    });
    expect(result.files.length).toBe(1);
    expect(result.files[0].path).toBe('src/domain/file2.spec.ts');
  });
});

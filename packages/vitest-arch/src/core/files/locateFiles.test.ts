import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { locateFiles } from './locateFiles';

describe('locateFiles', () => {
  it('should filter files by inFolder query', () => {
    const file1 = createSourceFile('function a() {}', 'src/domain/file1.ts');
    const file2 = createSourceFile('function b() {}', 'src/infra/file2.ts');
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateFiles([file1, file2], {} as any, {
      inFolder: 'domain',
    });
    expect(result.files.length).toBe(1);
    expect(result.files[0].fileName).toBe('src/domain/file1.ts');
  });

  it('should filter files by matchNamePattern query', () => {
    const file1 = createSourceFile('function a() {}', 'src/domain/file1.ts');
    const file2 = createSourceFile(
      'function b() {}',
      'src/domain/file2.spec.ts',
    );
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateFiles([file1, file2], {} as any, {
      matchNamePattern: /\.spec\.ts$/,
    });
    expect(result.files.length).toBe(1);
    expect(result.files[0].fileName).toBe('src/domain/file2.spec.ts');
  });
});

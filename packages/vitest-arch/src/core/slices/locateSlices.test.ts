import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { locateSlices } from './locateSlices';

describe('locateSlices', () => {
  it('should group files into slices based on pattern', () => {
    const file1 = createSourceFile('', 'src/domain/auth/index.ts');
    const file2 = createSourceFile('', 'src/domain/users/index.ts');
    const file3 = createSourceFile('', 'src/domain/users/user.ts');
    const result = locateSlices(
      [file1, file2, file3],
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      {} as any,
      'src/domain/*',
    );

    expect(result.sliceIds.size).toBe(2);
    expect(result.sliceIds.has('auth')).toBe(true);
    expect(result.sliceIds.has('users')).toBe(true);
    expect(result.sliceFiles.get('users')?.length).toBe(2);
  });
});

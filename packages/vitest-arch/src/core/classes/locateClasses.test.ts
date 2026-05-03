import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { locateClasses } from './locateClasses';

describe('locateClasses', () => {
  it('should filter classes by inFolder', () => {
    const file1 = createSourceFile('class A {}', 'src/domain/A.ts');
    const classes = getClasses(file1);
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const result = locateClasses(classes, {} as any, { inFolder: 'infra' });
    expect(result.classes.length).toBe(0);
  });
});

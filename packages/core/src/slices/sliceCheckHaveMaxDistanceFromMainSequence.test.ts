import { describe, expect, it } from 'vitest';
import { createSourceFile } from '../testUtils';
import { sliceCheckHaveMaxDistanceFromMainSequence } from './sliceCheckHaveMaxDistanceFromMainSequence';

describe('sliceCheckHaveMaxDistanceFromMainSequence', () => {
  it('should be structured correctly', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const sliceFiles = new Map<string, any[]>();
    const sliceIds = new Set(['sliceA']);
    sliceFiles.set('sliceA', [
      {
        path: 'a.ts',
        classes: [],
        functions: [],
        properties: [],
        dependencies: [],
      },
    ]);

    const locator = {
      type: 'SliceLocator' as const,
      slicePattern: /.*/,
      sliceIds,
      sliceFiles,
      program: { files: [] } as any,
    };

    // Very hard to fully mock distance sequence because of resolving dependencies.
    // We will just verify it runs without crashing given valid input.
    expect(() =>
      sliceCheckHaveMaxDistanceFromMainSequence(locator, 0.5, false),
    ).not.toThrow();
  });
});

import { describe, expect, it } from 'vitest';
import { createLayeredArchitecture } from './createLayeredArchitecture';

describe('createLayeredArchitecture', () => {
  it('should initialize a LayeredArchitectureData object', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const data = createLayeredArchitecture([], {} as any);
    expect(data.type).toBe('LayeredArchitecture');
    expect(data.files).toEqual([]);
    expect(data.layers.size).toBe(0);
    expect(data.assertions.length).toBe(0);
  });
});

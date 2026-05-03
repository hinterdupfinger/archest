import { describe, expect, it } from 'vitest';
import { checkLayeredArchitecture } from './checkLayeredArchitecture';
import { createLayeredArchitecture } from './createLayeredArchitecture';

describe('checkLayeredArchitecture', () => {
  it('should evaluate all assertions and return true if none fail', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const data = createLayeredArchitecture([], {} as any);
    data.assertions.push(() => []); // returns no violations
    const result = checkLayeredArchitecture(data);
    expect(result.pass).toBe(true);
    expect(result.message()).toBe('');
  });

  it('should return false if any assertion yields violations', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    const data = createLayeredArchitecture([], {} as any);
    data.assertions.push(() => ['Layer violation!']);
    const result = checkLayeredArchitecture(data);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Layer violation!');
  });
});

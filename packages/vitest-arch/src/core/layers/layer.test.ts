import { describe, expect, it } from 'vitest';
import { createLayeredArchitecture } from './createLayeredArchitecture';
import { layer } from './layer';

describe('layer', () => {
  it('should add a layer pattern to the architecture data', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    let data = createLayeredArchitecture([], {} as any);
    data = layer(data, 'Domain', 'src/domain');
    expect(data.layers.get('Domain')).toBe('src/domain');
  });
});

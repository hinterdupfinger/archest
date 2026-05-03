import { describe, expect, it } from 'vitest';
import { createLayeredArchitecture } from './createLayeredArchitecture';
import { layer } from './layer';
import { layerShouldOnlyBeAccessedBy } from './layerShouldOnlyBeAccessedBy';

describe('layerShouldOnlyBeAccessedBy', () => {
  it('should push an assertion to the data', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    let data = createLayeredArchitecture([], {} as any);
    data = layer(data, 'Domain', 'src/domain');
    data = layer(data, 'Infra', 'src/infra');
    data = layerShouldOnlyBeAccessedBy(data, 'Domain', ['Infra']);
    expect(data.assertions.length).toBe(1);
  });
});

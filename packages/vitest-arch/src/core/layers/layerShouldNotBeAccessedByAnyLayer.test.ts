import { describe, expect, it } from 'vitest';
import { createLayeredArchitecture } from './createLayeredArchitecture';
import { layer } from './layer';
import { layerShouldNotBeAccessedByAnyLayer } from './layerShouldNotBeAccessedByAnyLayer';

describe('layerShouldNotBeAccessedByAnyLayer', () => {
  it('should push an assertion to the data', () => {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
    let data = createLayeredArchitecture([], {} as any);
    data = layer(data, 'Domain', 'src/domain');
    data = layerShouldNotBeAccessedByAnyLayer(data, 'Domain');
    expect(data.assertions.length).toBe(1);
  });
});

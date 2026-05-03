import type { LayeredArchitectureData } from './types';

export function layer(
  data: LayeredArchitectureData,
  name: string,
  folderPattern: string,
): LayeredArchitectureData {
  data.layers.set(name, folderPattern);
  return data;
}

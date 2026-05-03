import { getLayerDependencies } from './getLayerDependencies';
import type { LayeredArchitectureData } from './types';

export function layerShouldOnlyBeAccessedBy(
  data: LayeredArchitectureData,
  targetLayer: string,
  allowedLayers: string[],
): LayeredArchitectureData {
  if (!data.layers.has(targetLayer)) {
    throw new Error(`Layer ${targetLayer} is not defined`);
  }

  data.assertions.push((files) => {
    const violations: string[] = [];
    // biome-ignore lint/style/noNonNullAssertion: Safe map lookup
    const targetPattern = data.layers.get(targetLayer)!;
    // biome-ignore lint/style/noNonNullAssertion: Safe map lookup
    const allowedPatterns = allowedLayers.map((l) => data.layers.get(l)!);

    for (const file of files) {
      const filePath = file.fileName;
      const isInAllowedLayer = allowedPatterns.some(
        (p) => filePath.includes(`/${p}/`) || filePath.includes(`\\${p}\\`),
      );

      if (
        !filePath.includes(`/${targetPattern}/`) &&
        !filePath.includes(`\\${targetPattern}\\`) &&
        !isInAllowedLayer
      ) {
        const dependencies = getLayerDependencies(file, data.program);
        const importsTarget = dependencies.some(
          (dep) =>
            dep.includes(`/${targetPattern}/`) ||
            dep.includes(`\\${targetPattern}\\`),
        );
        if (importsTarget) {
          violations.push(
            `File ${filePath} accesses layer ${targetLayer} but only ${allowedLayers.join(', ')} are allowed.`,
          );
        }
      }
    }
    return violations;
  });

  return data;
}

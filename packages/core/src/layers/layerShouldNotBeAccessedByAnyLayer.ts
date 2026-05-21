import { getLayerDependencies } from './getLayerDependencies';
import type { LayeredArchitectureData } from './types';

export function layerShouldNotBeAccessedByAnyLayer(
  data: LayeredArchitectureData,
  targetLayer: string,
): LayeredArchitectureData {
  if (!data.layers.has(targetLayer)) {
    throw new Error(`Layer ${targetLayer} is not defined`);
  }

  data.assertions.push((files) => {
    const violations: string[] = [];
    // biome-ignore lint/style/noNonNullAssertion: Safe map lookup
    const targetPattern = data.layers.get(targetLayer)!;

    for (const file of files) {
      const filePath = file.path;
      if (
        !filePath.includes(`/${targetPattern}/`) &&
        !filePath.includes(`\\${targetPattern}\\`)
      ) {
        const dependencies = getLayerDependencies(file, data.projectData);
        const importsTarget = dependencies.some(
          (dep) =>
            dep.includes(`/${targetPattern}/`) ||
            dep.includes(`\\${targetPattern}\\`),
        );
        if (importsTarget) {
          violations.push(
            `File ${filePath} accesses layer ${targetLayer} but it shouldn't.`,
          );
        }
      }
    }
    return violations;
  });

  return data;
}

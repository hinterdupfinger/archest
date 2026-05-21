import type { RuleResult } from '../types';
import type { SliceLocatorData } from './types';

export function sliceCheckHaveMaxDistanceFromMainSequence(
  locator: SliceLocatorData,
  max: number,
  isNot: boolean,
): RuleResult {
  const violations: string[] = [];

  const ceMap = new Map<string, Set<string>>(); // Slices this slice depends on
  const caMap = new Map<string, Set<string>>(); // Slices depending on this slice

  for (const slice of locator.sliceIds) {
    ceMap.set(slice, new Set());
    caMap.set(slice, new Set());
  }

  for (const [sliceId, files] of locator.sliceFiles.entries()) {
    for (const sf of files) {
      if (!sf.dependencies) continue;
      for (const importPath of sf.dependencies) {
        const targetMatch = importPath.match(locator.slicePattern);
        if (targetMatch?.[1]) {
          const targetSlice = targetMatch[1];
          if (targetSlice !== sliceId && locator.sliceIds.has(targetSlice)) {
            ceMap.get(sliceId)?.add(targetSlice);
            caMap.get(targetSlice)?.add(sliceId);
          }
        }
      }
    }
  }

  for (const sliceId of locator.sliceIds) {
    const ce = ceMap.get(sliceId)?.size || 0;
    const ca = caMap.get(sliceId)?.size || 0;

    // biome-ignore lint/style/noNonNullAssertion: Safe map lookup
    const files = locator.sliceFiles.get(sliceId)!;
    let na = 0; // abstract classes + interfaces
    let nc = 0; // all classes + interfaces

    for (const sf of files) {
      for (const c of sf.classes) {
        nc++;
        if (c.is_abstract) {
          na++;
        }
      }
    }

    const I = ce + ca === 0 ? 0 : ce / (ca + ce);
    const A = nc === 0 ? 0 : na / nc;

    const D = Math.abs(A + I - 1);
    const exceeds = D > max;

    if (isNot && exceeds) {
      violations.push(
        `Slice ${sliceId} has a Distance from the Main Sequence of ${D.toFixed(2)}, which exceeds the maximum of ${max}, but it shouldn't.`,
      );
    } else if (!isNot && exceeds) {
      violations.push(
        `Slice ${sliceId} has a Distance from the Main Sequence of ${D.toFixed(2)}, which exceeds the maximum of ${max}.`,
      );
    }
  }

  return {
    pass: isNot ? violations.length > 0 : violations.length === 0,
    message: () =>
      violations.join('\n') ||
      (isNot
        ? 'Expected some slices to exceed maximum distance from main sequence, but none did.'
        : ''),
  };
}

import type { RuleResult } from '../types';
import type { LayeredArchitectureData } from './types';

export function checkLayeredArchitecture(
  data: LayeredArchitectureData,
): RuleResult {
  const violations: string[] = [];
  for (const assertion of data.assertions) {
    violations.push(...assertion(data.files));
  }
  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

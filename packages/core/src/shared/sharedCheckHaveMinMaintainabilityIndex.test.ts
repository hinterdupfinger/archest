import { describe, expect, it } from 'vitest';
import { sharedCheckHaveMinMaintainabilityIndex } from './sharedCheckHaveMinMaintainabilityIndex';

describe('sharedCheckHaveMinMaintainabilityIndex', () => {
  it('should pass if MI is above limit', () => {
    const items = [{ name: 'A', mi: 50 }];
    const result = sharedCheckHaveMinMaintainabilityIndex(
      items,
      (i) => i.name,
      (i) => i.mi,
      'Item',
      20,
      false,
    );
    expect(result.pass).toBe(true);
  });

  it('should fail if MI is below limit', () => {
    const items = [{ name: 'A', mi: 10 }];
    const result = sharedCheckHaveMinMaintainabilityIndex(
      items,
      (i) => i.name,
      (i) => i.mi,
      'Item',
      20,
      false,
    );
    expect(result.pass).toBe(false);
  });
});

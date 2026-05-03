import { describe, expect, it } from 'vitest';
import { buildRule } from './ruleBuilder';

describe('ruleBuilder edge cases', () => {
  it('should pass if items array is empty', () => {
    const result = buildRule([], false, () => ({
      passes: false,
      failMessage: '',
      failNotMessage: '',
    }));
    expect(result.pass).toBe(true);
  });

  it('should generate correct violation message with NOT', () => {
    const items = [{ name: 'A' }];
    const result = buildRule(items, true, () => ({
      passes: true,
      failMessage: '',
      failNotMessage: 'Item A should NOT be nice',
    }));
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Item A should NOT be nice');
  });
});

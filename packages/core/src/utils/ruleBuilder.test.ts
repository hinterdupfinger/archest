import { describe, expect, it } from 'vitest';
import { ruleBuilder } from './ruleBuilder';

describe('ruleBuilder edge cases', () => {
  it('should fail if items array is empty', () => {
    const result = ruleBuilder([], false, () => ({
      passes: false,
      failMessage: '',
      failNotMessage: '',
    }));
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('vacuous');
  });

  it('should generate correct violation message with NOT', () => {
    const items = [{ name: 'A' }];
    const result = ruleBuilder(items, true, () => ({
      passes: true,
      failMessage: '',
      failNotMessage: 'Item A should NOT be nice',
    }));
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('Item A should NOT be nice');
  });
});

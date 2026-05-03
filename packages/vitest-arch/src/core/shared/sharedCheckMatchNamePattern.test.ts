import { describe, expect, it } from 'vitest';
import { sharedCheckMatchNamePattern } from './sharedCheckMatchNamePattern';

describe('sharedCheckMatchNamePattern', () => {
  it('should pass if all items match the pattern', () => {
    const items = [{ name: 'UserService' }, { name: 'AuthService' }];
    const result = sharedCheckMatchNamePattern(
      items,
      (i) => i.name,
      'Item',
      /Service$/,
      false,
    );
    expect(result.pass).toBe(true);
  });

  it('should fail if any item does not match the pattern', () => {
    const items = [{ name: 'UserService' }, { name: 'AuthRepository' }];
    const result = sharedCheckMatchNamePattern(
      items,
      (i) => i.name,
      'Item',
      /Service$/,
      false,
    );
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('AuthRepository does not match pattern');
  });
});

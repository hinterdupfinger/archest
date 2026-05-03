import { describe, expect, it } from 'vitest';
import { classCheckResideInFolder } from './classCheckResideInFolder';

describe('classCheckResideInFolder', () => {
  it('should exist and be callable', () => {
    expect(typeof classCheckResideInFolder).toBe('function');
  });
});

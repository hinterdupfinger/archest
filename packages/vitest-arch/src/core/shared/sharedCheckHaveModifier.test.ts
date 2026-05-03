import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { sharedCheckHaveModifier } from './sharedCheckHaveModifier';

describe('sharedCheckHaveModifier', () => {
  it('should pass if node has the modifier', () => {
    const sourceFile = createSourceFile('export class MyClass {}');
    const classes = getClasses(sourceFile);
    const result = sharedCheckHaveModifier(
      classes,
      (c) => c.name?.text,
      'Class',
      'export',
      false,
    );
    expect(result.pass).toBe(true);
  });

  it('should fail if node does not have the modifier', () => {
    const sourceFile = createSourceFile('class MyClass {}');
    const classes = getClasses(sourceFile);
    const result = sharedCheckHaveModifier(
      classes,
      (c) => c.name?.text,
      'Class',
      'export',
      false,
    );
    expect(result.pass).toBe(false);
  });
});

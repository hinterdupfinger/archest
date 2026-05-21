import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { classCheckExtendClass } from './classCheckExtendClass';
import type { ClassLocatorData } from './types';

describe('classCheckExtendClass', () => {
  it('should pass if class extends correctly', () => {
    const sourceFile = createSourceFile(`class Test extends Base {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckExtendClass(data, 'Base', false);
    expect(result.pass).toBe(true);
  });

  it('should fail if class does not extend correctly', () => {
    const sourceFile = createSourceFile(`class Test extends Other {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckExtendClass(data, 'Base', false);
    expect(result.pass).toBe(false);
  });
});

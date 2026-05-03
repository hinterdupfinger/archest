import { describe, expect, it } from 'vitest';
import { createSourceFile, getClasses } from '../testUtils';
import { classCheckImplementInterface } from './classCheckImplementInterface';
import type { ClassLocatorData } from './types';

describe('classCheckImplementInterface', () => {
  it('should pass if class implements interface', () => {
    const sourceFile = createSourceFile(`class Test implements IBase {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckImplementInterface(data, 'IBase', false);
    expect(result.pass).toBe(true);
  });

  it('should fail if class does not implement interface', () => {
    const sourceFile = createSourceFile(`class Test {}`);
    const data: ClassLocatorData = {
      type: 'ClassLocator',
      classes: getClasses(sourceFile),
      // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
      program: {} as any,
    };
    const result = classCheckImplementInterface(data, 'IBase', false);
    expect(result.pass).toBe(false);
  });
});

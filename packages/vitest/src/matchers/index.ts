import {
  checkDependOnExternalModule,
  checkDependOnFilesInFolder,
  checkLayeredArchitecture,
  classCheckExtendClass,
  classCheckHaveMaxCyclomaticComplexity,
  classCheckHaveModifier,
  classCheckHaveNameMatchingFileName,
  classCheckImplementInterface,
  classCheckMatchNamePattern,
  classCheckResideInFolder,
  fileCheckBeFreeOfCycles,
  fileCheckHaveMaxCyclomaticComplexity,
  fileCheckHaveMaxExportedFunctions,
  fileCheckHaveMinMaintainabilityIndex,
  fileCheckMatchNamePattern,
  functionCheckHaveExplicitReturnType,
  functionCheckHaveMaxCyclomaticComplexity,
  functionCheckHaveMinMaintainabilityIndex,
  functionCheckHaveModifier,
  functionCheckHaveNameMatchingFileName,
  functionCheckMatchNamePattern,
  type LocatorData,
  propertyCheckBeReadonly,
  type RuleResult,
  sliceCheckBeFreeOfCycles,
  sliceCheckHaveMaxDistanceFromMainSequence,
} from '@archest/core';
import { expect } from 'vitest';

export * from './models';

/**
 * Registers all Archest custom matchers (e.g., `toResideInFolder`, `toHaveModifier`)
 * with the global Vitest `expect` instance.
 *
 * This function must be called exactly once before any architectural tests are run.
 * The standard way to do this is to add it to a Vitest setup file.
 *
 * @example
 * ```typescript
 * // test/setup.ts
 * import { setupMatchers } from '@archest/vitest';
 * setupMatchers();
 * ```
 */
export function setupMatchers() {
  expect.extend({
    // biome-ignore lint/suspicious/noExplicitAny: Matcher signature
    toPass(received: any) {
      let result: RuleResult;

      if (received?.data && received.data.type === 'LayeredArchitecture') {
        result = checkLayeredArchitecture(received.data);
      } else {
        result = received as RuleResult;
      }

      const { pass, message } = result;
      return {
        pass: this.isNot ? !pass : pass,
        message: pass ? () => 'Expected rule not to pass' : () => message(),
      };
    },

    toResideInFolder(received: LocatorData, folder: string) {
      let result: RuleResult;
      if (received.type === 'ClassLocator') {
        result = classCheckResideInFolder(received, folder, this.isNot);
      } else {
        throw new Error(
          `toResideInFolder matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveModifier(received: LocatorData, modifier: string) {
      let result: RuleResult;
      if (received.type === 'ClassLocator') {
        result = classCheckHaveModifier(received, modifier, this.isNot);
      } else if (received.type === 'FunctionLocator') {
        result = functionCheckHaveModifier(received, modifier, this.isNot);
      } else {
        throw new Error(
          `toHaveModifier matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toExtendClass(received: LocatorData, className: string) {
      let result: RuleResult;
      if (received.type === 'ClassLocator') {
        result = classCheckExtendClass(received, className, this.isNot);
      } else {
        throw new Error(
          `toExtendClass matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toImplementInterface(received: LocatorData, interfaceName: string) {
      let result: RuleResult;
      if (received.type === 'ClassLocator') {
        result = classCheckImplementInterface(
          received,
          interfaceName,
          this.isNot,
        );
      } else {
        throw new Error(
          `toImplementInterface matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveExplicitReturnType(received: LocatorData) {
      let result: RuleResult;
      if (received.type === 'FunctionLocator') {
        result = functionCheckHaveExplicitReturnType(received, this.isNot);
      } else {
        throw new Error(
          `toHaveExplicitReturnType matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toBeReadonly(received: LocatorData) {
      let result: RuleResult;
      if (received.type === 'PropertyLocator') {
        result = propertyCheckBeReadonly(received, this.isNot);
      } else {
        throw new Error(
          `toBeReadonly matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toDependOnFilesInFolder(received: LocatorData, folder: string) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = checkDependOnFilesInFolder(received, folder, this.isNot);
      } else {
        throw new Error(
          `toDependOnFilesInFolder matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toDependOnExternalModule(
      received: LocatorData,
      moduleName: string | RegExp,
    ) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = checkDependOnExternalModule(received, moduleName, this.isNot);
      } else {
        throw new Error(
          `toDependOnExternalModule matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toBeFreeOfCycles(received: LocatorData) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = fileCheckBeFreeOfCycles(received, this.isNot);
      } else if (received.type === 'SliceLocator') {
        result = sliceCheckBeFreeOfCycles(received, this.isNot);
      } else {
        throw new Error(
          `toBeFreeOfCycles matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toMatchNamePattern(received: LocatorData, pattern: string | RegExp) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = fileCheckMatchNamePattern(received, pattern, this.isNot);
      } else if (received.type === 'ClassLocator') {
        result = classCheckMatchNamePattern(received, pattern, this.isNot);
      } else if (received.type === 'FunctionLocator') {
        result = functionCheckMatchNamePattern(received, pattern, this.isNot);
      } else {
        throw new Error(
          `toMatchNamePattern matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveMaxCyclomaticComplexity(received: LocatorData, max: number) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = fileCheckHaveMaxCyclomaticComplexity(
          received,
          max,
          this.isNot,
        );
      } else if (received.type === 'ClassLocator') {
        result = classCheckHaveMaxCyclomaticComplexity(
          received,
          max,
          this.isNot,
        );
      } else if (received.type === 'FunctionLocator') {
        result = functionCheckHaveMaxCyclomaticComplexity(
          received,
          max,
          this.isNot,
        );
      } else {
        throw new Error(
          `toHaveMaxCyclomaticComplexity matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveMinMaintainabilityIndex(received: LocatorData, min: number) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = fileCheckHaveMinMaintainabilityIndex(
          received,
          min,
          this.isNot,
        );
      } else if (received.type === 'FunctionLocator') {
        result = functionCheckHaveMinMaintainabilityIndex(
          received,
          min,
          this.isNot,
        );
      } else {
        throw new Error(
          `toHaveMinMaintainabilityIndex matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveMaxDistanceFromMainSequence(received: LocatorData, max: number) {
      let result: RuleResult;
      if (received.type === 'SliceLocator') {
        result = sliceCheckHaveMaxDistanceFromMainSequence(
          received,
          max,
          this.isNot,
        );
      } else {
        throw new Error(
          `toHaveMaxDistanceFromMainSequence matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveNameMatchingFileName(received: LocatorData) {
      let result: RuleResult;
      if (received.type === 'FunctionLocator') {
        result = functionCheckHaveNameMatchingFileName(received, this.isNot);
      } else if (received.type === 'ClassLocator') {
        result = classCheckHaveNameMatchingFileName(received, this.isNot);
      } else {
        throw new Error(
          `toHaveNameMatchingFileName matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },

    toHaveMaxExportedFunctions(received: LocatorData, max: number) {
      let result: RuleResult;
      if (received.type === 'FileLocator') {
        result = fileCheckHaveMaxExportedFunctions(received, max, this.isNot);
      } else {
        throw new Error(
          `toHaveMaxExportedFunctions matcher does not support ${received.type}`,
        );
      }
      return {
        pass: this.isNot ? !result.pass : result.pass,
        message: result.message,
      };
    },
  });
}

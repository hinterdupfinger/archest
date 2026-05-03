import { expect } from 'vitest';
import { classCheckExtendClass } from '../core/classes/classCheckExtendClass';
import { classCheckHaveMaxCyclomaticComplexity } from '../core/classes/classCheckHaveMaxCyclomaticComplexity';
import { classCheckHaveModifier } from '../core/classes/classCheckHaveModifier';
import { classCheckHaveNameMatchingFileName } from '../core/classes/classCheckHaveNameMatchingFileName';
import { classCheckImplementInterface } from '../core/classes/classCheckImplementInterface';
import { classCheckMatchNamePattern } from '../core/classes/classCheckMatchNamePattern';
import { classCheckResideInFolder } from '../core/classes/classCheckResideInFolder';
import { checkDependOnFilesInFolder } from '../core/files/checkDependOnFilesInFolder';
import { fileCheckBeFreeOfCycles } from '../core/files/fileCheckBeFreeOfCycles';
import { fileCheckHaveMaxCyclomaticComplexity } from '../core/files/fileCheckHaveMaxCyclomaticComplexity';
import { fileCheckHaveMaxExportedFunctions } from '../core/files/fileCheckHaveMaxExportedFunctions';
import { fileCheckHaveMinMaintainabilityIndex } from '../core/files/fileCheckHaveMinMaintainabilityIndex';
import { fileCheckMatchNamePattern } from '../core/files/fileCheckMatchNamePattern';
import { functionCheckHaveExplicitReturnType } from '../core/functions/functionCheckHaveExplicitReturnType';
import { functionCheckHaveMaxCyclomaticComplexity } from '../core/functions/functionCheckHaveMaxCyclomaticComplexity';
import { functionCheckHaveMinMaintainabilityIndex } from '../core/functions/functionCheckHaveMinMaintainabilityIndex';
import { functionCheckHaveModifier } from '../core/functions/functionCheckHaveModifier';
import { functionCheckHaveNameMatchingFileName } from '../core/functions/functionCheckHaveNameMatchingFileName';
import { functionCheckMatchNamePattern } from '../core/functions/functionCheckMatchNamePattern';
import { checkLayeredArchitecture } from '../core/layers/checkLayeredArchitecture';

import { propertyCheckBeReadonly } from '../core/properties/propertyCheckBeReadonly';

import { sliceCheckBeFreeOfCycles } from '../core/slices/sliceCheckBeFreeOfCycles';
import { sliceCheckHaveMaxDistanceFromMainSequence } from '../core/slices/sliceCheckHaveMaxDistanceFromMainSequence';
import type { LocatorData, RuleResult } from '../core/types';

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

declare module 'vitest' {
  // biome-ignore lint/suspicious/noExplicitAny: Matcher signature
  interface Assertion<T = any> {
    toPass(): void;
    toResideInFolder(folder: string): void;
    toHaveModifier(
      modifier:
        | 'export'
        | 'default'
        | 'abstract'
        | 'async'
        | 'private'
        | 'public',
    ): void;
    toExtendClass(className: string): void;
    toImplementInterface(interfaceName: string): void;
    toHaveExplicitReturnType(): void;
    toBeReadonly(): void;
    toDependOnFilesInFolder(folder: string): void;
    toBeFreeOfCycles(): void;
    toMatchNamePattern(pattern: string | RegExp): void;
    toHaveMaxCyclomaticComplexity(max: number): void;
    toHaveMinMaintainabilityIndex(min: number): void;
    toHaveMaxDistanceFromMainSequence(max: number): void;
    toHaveNameMatchingFileName(): void;
    toHaveMaxExportedFunctions(max: number): void;
  }
}

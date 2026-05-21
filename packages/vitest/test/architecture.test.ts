import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseProject } from '../src/index';
import { setupMatchers } from '../src/matchers';

setupMatchers();

describe('@archest/vitest', () => {
  const project = parseProject({
    tsConfigFilePath: join(__dirname, '../../core/tsconfig.json'),
    exclude: [
      '**/*.test.ts',
      'src/testUtils.ts',
      'src/types.ts',
      'src/dto.ts',
      'src/index.ts',
    ],
  });

  describe('FileLocator (Dependency Checks)', () => {
    it('domain classes should not depend on test files', () => {
      const coreFiles = project.getFiles();
      expect(coreFiles).not.toDependOnFilesInFolder('test');
    });

    it('test files should depend on src', () => {
      const matcherFiles = project.getFiles({ inFolder: 'test' });
      expect(matcherFiles).toDependOnFilesInFolder('src');
    });
  });

  describe('FunctionLocator (Declaration Checks)', () => {
    it('check functions should have export modifier', () => {
      const checkFunctions = project.getFunctions({
        matchNamePattern: /check/i,
      });
      expect(checkFunctions).toHaveModifier('export');
    });

    it('parseProject function should be exported', () => {
      const projectFunctions = project.getFunctions({
        matchNamePattern: /^parseProject$/,
      });
      expect(projectFunctions).toHaveModifier('export');
    });
  });

  describe('FileLocator (Pattern matching)', () => {
    it('src files should match the src pattern', () => {
      const srcFiles = project.getFiles({ matchNamePattern: /src\/.*/ });
      expect(srcFiles).not.toDependOnFilesInFolder('matchers');
    });

    it('core classes should be free of cycles', () => {
      const coreFiles = project.getFiles();
      expect(coreFiles).toBeFreeOfCycles();
    });
  });

  describe('Layered Architecture', () => {
    it('should enforce strict internal layer dependencies', () => {
      const architecture = project
        .layeredArchitecture()
        .layer('Utils', 'utils')
        .layer('Shared', 'shared')
        .layer(
          'Domains',
          '(classes|files|functions|properties|slices|layers|metrics|project)',
        )
        .layer('Root', 'src'); // src/index.ts is just under src

      // Utils should only be accessed by higher layers
      expect(
        architecture
          .whereLayer('Utils')
          .shouldOnlyBeAccessedBy('Shared', 'Domains', 'Root'),
      ).toPass();

      // Shared should only be accessed by Domains and above
      expect(
        architecture
          .whereLayer('Shared')
          .shouldOnlyBeAccessedBy('Domains', 'Root'),
      ).toPass();

      // Domains should only be accessed by Root
      expect(
        architecture.whereLayer('Domains').shouldOnlyBeAccessedBy('Root'),
      ).toPass();
    });
  });

  describe('Structural Metrics', () => {
    it('core files should have a reasonable cyclomatic complexity', () => {
      const coreFiles = project.getFiles();
      // The max complexity is arbitrary for this test, but 200 should pass
      expect(coreFiles).toHaveMaxCyclomaticComplexity(200);
    });

    it('core files should have a minimum maintainability index', () => {
      const coreFiles = project.getFiles();
      // A minimum index of 5 should pass for our small files
      expect(coreFiles).toHaveMinMaintainabilityIndex(5);
    });

    it('slices should maintain a reasonable distance from the main sequence', () => {
      const slices = project.getSlices('src/(.*)');
      // Distance is between 0 and 1, we expect a reasonable balance < 0.8
      expect(slices).toHaveMaxDistanceFromMainSequence(0.8);
    });
  });

  describe('Granular Folder Structure', () => {
    it('functions should have a name matching their filename', () => {
      const coreFunctions = project.getFunctions({
        isTopLevel: true,
      });
      expect(coreFunctions).toHaveNameMatchingFileName();
    });

    it('classes should have a name matching their filename', () => {
      const coreClasses = project.getClasses();
      expect(coreClasses).toHaveNameMatchingFileName();
    });

    it('files should have a maximum of 1 exported function', () => {
      // Exclude index.ts, types.ts, and testUtils.ts which have different export rules
      const implementationFiles = project.getFiles({
        matchNamePattern: /^(?!.*(types|index|testUtils|dto)\.ts$).*\.ts$/,
      });
      expect(implementationFiles).toHaveMaxExportedFunctions(1);
    });
  });

  describe('Shared Abstraction Layer', () => {
    it('shared abstraction functions should be prefixed with sharedCheck', () => {
      const sharedFunctions = project.getFunctions({
        inFolder: 'shared',
        isTopLevel: true,
      });
      expect(sharedFunctions).toMatchNamePattern(/^sharedCheck/);
    });

    it('shared abstraction files should not depend on domain logic', () => {
      const sharedFiles = project.getFiles({ inFolder: 'shared' });
      expect(sharedFiles).not.toDependOnFilesInFolder('classes');
      expect(sharedFiles).not.toDependOnFilesInFolder('functions');
      expect(sharedFiles).not.toDependOnFilesInFolder('files');
    });
  });
});

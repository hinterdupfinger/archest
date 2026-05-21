import { dirname } from 'node:path';
import { ArchestProject } from '@archest/core-rust';
import * as ts from 'typescript';
import { locateClasses } from '../classes/locateClasses';
import type { ClassQueryOptions } from '../classes/types';
import type { ProjectData } from '../dto';
import { locateFiles } from '../files/locateFiles';
import type { FileQueryOptions } from '../files/types';
import { locateFunctions } from '../functions/locateFunctions';
import type { FunctionQueryOptions } from '../functions/types';
import { checkLayeredArchitecture } from '../layers/checkLayeredArchitecture';
import { createLayeredArchitecture } from '../layers/createLayeredArchitecture';
import { layer } from '../layers/layer';
import { layerShouldNotBeAccessedByAnyLayer } from '../layers/layerShouldNotBeAccessedByAnyLayer';
import { layerShouldOnlyBeAccessedBy } from '../layers/layerShouldOnlyBeAccessedBy';
import { locateProperties } from '../properties/locateProperties';
import type { PropertyQueryOptions } from '../properties/types';
import { locateSlices } from '../slices/locateSlices';

/**
 * Options to configure how the project is parsed and analyzed.
 */
export interface ParseProjectOptions {
  /** 
   * An optional absolute path to a specific tsconfig.json file.
   * If omitted, Archest will attempt to find the nearest tsconfig.json in the current working directory.
   */
  tsConfigFilePath?: string;
  /** An array of glob patterns specifying which files to include in the AST parsing. Overrides the tsconfig.json `include` array. */
  include?: string[];
  /** An array of glob patterns specifying which files to exclude from the AST parsing. Overrides the tsconfig.json `exclude` array. */
  exclude?: string[];
}

/**
 * The primary entry point for Archest. Parses a TypeScript or JavaScript project into a searchable
 * Abstract Syntax Tree (AST) using the high-performance native Rust engine.
 *
 * @param options - Optional configuration for locating the tsconfig and filtering files.
 * @returns A fluent API object containing Locators used to query the project's architecture.
 *
 * @example
 * ```typescript
 * import { parseProject } from '@archest/vitest';
 * 
 * const project = parseProject({
 *   include: ['src/domain/**\/*.ts'],
 *   exclude: ['**\/*.test.ts']
 * });
 * 
 * const domainFiles = project.getFiles();
 * ```
 */
export function parseProject(options: ParseProjectOptions = {}) {
  const configPath =
    options.tsConfigFilePath ||
    ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');

  if (!configPath) {
    throw new Error('Could not find tsconfig.json');
  }

  const projectDir = dirname(configPath);
  
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (options.include) configFile.config.include = options.include;
  if (options.exclude) configFile.config.exclude = options.exclude;

  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    projectDir,
    undefined,
    configPath,
    undefined,
    [
      {
        extension: '.vue',
        isMixedContent: true,
        scriptKind: ts.ScriptKind.TS,
      },
      {
        extension: '.svelte',
        isMixedContent: true,
        scriptKind: ts.ScriptKind.TS,
      },
    ],
  );

  const archestProject = ArchestProject.parse(parsedCommandLine.fileNames);
  const projectData: ProjectData = JSON.parse(archestProject.getProjectData());

  return {
    projectData,
    getFiles: (queryOptions?: FileQueryOptions) => {
      return locateFiles(projectData.files, projectData, archestProject, queryOptions);
    },

    getClasses: (queryOptions?: ClassQueryOptions) => {
      const allClasses = projectData.files.flatMap((f) =>
        f.classes.map((c) => ({ ...c, _filePath: f.path })),
      );
      return locateClasses(allClasses, projectData, queryOptions);
    },

    layeredArchitecture: () => {
      let data = createLayeredArchitecture(projectData.files, projectData);
      const api = {
        layer: (name: string, folderPattern: string) => {
          data = layer(data, name, folderPattern);
          return api;
        },
        whereLayer: (name: string) => {
          return {
            shouldNotBeAccessedByAnyLayer: () => {
              data = layerShouldNotBeAccessedByAnyLayer(data, name);
              return api;
            },
            shouldOnlyBeAccessedBy: (...allowedLayers: string[]) => {
              data = layerShouldOnlyBeAccessedBy(data, name, allowedLayers);
              return api;
            },
          };
        },
        check: () => checkLayeredArchitecture(data),
        get data() {
          return data;
        },
      };
      return api;
    },

    getFunctions: (queryOptions?: FunctionQueryOptions) => {
      const allFunctions = projectData.files.flatMap((f) =>
        f.functions.map((fn) => ({ ...fn, _filePath: f.path })),
      );
      return locateFunctions(allFunctions, projectData, queryOptions);
    },

    getProperties: (queryOptions?: PropertyQueryOptions) => {
      const allProperties = projectData.files.flatMap((f) =>
        f.properties.map((p) => ({ ...p, _filePath: f.path })),
      );
      return locateProperties(allProperties, projectData, queryOptions);
    },

    getSlices: (pattern: string) => {
      return locateSlices(projectData.files, projectData, pattern);
    },
  };
}

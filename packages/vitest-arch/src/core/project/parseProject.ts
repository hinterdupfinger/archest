import * as path from 'node:path';
import * as ts from 'typescript';
import { locateClasses } from '../classes/locateClasses';
import type { ClassQueryOptions } from '../classes/types';
import { locateFiles } from '../files/locateFiles';
import type { FileQueryOptions } from '../files/types';
import { locateFunctions } from '../functions/locateFunctions';
import type { FunctionQueryOptions } from '../functions/types';
import { createLayeredArchitecture } from '../layers/createLayeredArchitecture';
import { layer } from '../layers/layer';
import { layerShouldNotBeAccessedByAnyLayer } from '../layers/layerShouldNotBeAccessedByAnyLayer';
import { layerShouldOnlyBeAccessedBy } from '../layers/layerShouldOnlyBeAccessedBy';
import { locateProperties } from '../properties/locateProperties';
import type { PropertyQueryOptions } from '../properties/types';
import { locateSlices } from '../slices/locateSlices';

export function parseProject(options: { tsConfigFilePath?: string } = {}) {
  let compilerOptions: ts.CompilerOptions = {};
  const configPath =
    options.tsConfigFilePath ||
    ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');

  let program: ts.Program;

  if (configPath) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedCommandLine = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      path.dirname(configPath),
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
    compilerOptions = parsedCommandLine.options;

    const host = ts.createCompilerHost(compilerOptions);
    const originalGetSourceFile = host.getSourceFile;

    // biome-ignore lint/suspicious/noExplicitAny: Dynamic require
    let vueCompiler: any;
    try {
      vueCompiler = require('@vue/compiler-sfc');
    } catch (_e) {
      // Not a Vue project
    }

    host.getSourceFile = (
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    ) => {
      if (fileName.endsWith('.vue')) {
        const content = ts.sys.readFile(fileName);
        if (content) {
          let scriptContent = '';
          if (vueCompiler) {
            const parsed = vueCompiler.parse(content);
            const script = parsed.descriptor.script;
            const scriptSetup = parsed.descriptor.scriptSetup;
            if (script) scriptContent += `${script.content}\n`;
            if (scriptSetup) scriptContent += `${scriptSetup.content}\n`;
          } else {
            const match = content.match(/<script[^>]*>(.*?)<\/script>/s);
            if (match) scriptContent = match[1];
          }
          return ts.createSourceFile(
            fileName,
            scriptContent,
            languageVersion,
            true,
            ts.ScriptKind.TS,
          );
        }
      }

      if (fileName.endsWith('.svelte')) {
        const content = ts.sys.readFile(fileName);
        if (content) {
          let scriptContent = '';
          const match = content.match(/<script[^>]*>(.*?)<\/script>/s);
          if (match) scriptContent = match[1];
          return ts.createSourceFile(
            fileName,
            scriptContent,
            languageVersion,
            true,
            ts.ScriptKind.TS,
          );
        }
      }

      return originalGetSourceFile(
        fileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile,
      );
    };

    program = ts.createProgram({
      rootNames: parsedCommandLine.fileNames,
      options: compilerOptions,
      host: host,
    });
  } else {
    throw new Error('Could not find tsconfig.json');
  }

  const getSourceFiles = () =>
    program
      .getSourceFiles()
      .filter(
        (sf) => !sf.isDeclarationFile && !sf.fileName.includes('node_modules'),
      );

  return {
    getFiles: (queryOptions?: FileQueryOptions) => {
      return locateFiles(getSourceFiles(), program, queryOptions);
    },

    getClasses: (queryOptions?: ClassQueryOptions) => {
      const allClasses: ts.ClassDeclaration[] = [];
      for (const sf of getSourceFiles()) {
        const visit = (node: ts.Node) => {
          if (ts.isClassDeclaration(node)) {
            allClasses.push(node);
          }
          ts.forEachChild(node, visit);
        };
        visit(sf);
      }
      return locateClasses(allClasses, program, queryOptions);
    },

    layeredArchitecture: () => {
      let data = createLayeredArchitecture(getSourceFiles(), program);
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
        get data() {
          return data;
        },
      };
      return api;
    },

    getFunctions: (queryOptions?: FunctionQueryOptions) => {
      const allFunctions: ts.FunctionLikeDeclaration[] = [];
      for (const sf of getSourceFiles()) {
        const visit = (node: ts.Node) => {
          if (
            ts.isFunctionDeclaration(node) ||
            ts.isMethodDeclaration(node) ||
            ts.isArrowFunction(node)
          ) {
            allFunctions.push(node);
          }
          ts.forEachChild(node, visit);
        };
        visit(sf);
      }
      return locateFunctions(allFunctions, program, queryOptions);
    },

    getProperties: (queryOptions?: PropertyQueryOptions) => {
      const allProperties: ts.PropertyDeclaration[] = [];
      for (const sf of getSourceFiles()) {
        const visit = (node: ts.Node) => {
          if (ts.isPropertyDeclaration(node)) {
            allProperties.push(node);
          }
          ts.forEachChild(node, visit);
        };
        visit(sf);
      }
      return locateProperties(allProperties, program, queryOptions);
    },

    getSlices: (pattern: string) => {
      return locateSlices(getSourceFiles(), program, pattern);
    },
  };
}

import * as ts from 'typescript';
import type { ClassLocatorData, ClassQueryOptions } from './types';

export function locateClasses(
  classes: ts.ClassDeclaration[],
  program: ts.Program,
  options?: ClassQueryOptions,
): ClassLocatorData {
  let filtered = classes;

  if (options?.inFolder) {
    filtered = filtered.filter((c) => {
      const sourceFile = c.getSourceFile
        ? c.getSourceFile()
        : c.parent
          ? ts.getSourceFileOfNode(c)
          : undefined;
      if (!sourceFile) return false;
      return (
        sourceFile.fileName.includes(`/${options.inFolder}/`) ||
        sourceFile.fileName.includes(`\\${options.inFolder}\\`)
      );
    });
  }
  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((c) => {
      const name = c.name?.text;
      return name && regex.test(name);
    });
  }
  if (options?.withDecorator) {
    filtered = filtered.filter((c) => {
      const decorators = ts.canHaveDecorators(c)
        ? ts.getDecorators(c)
        : undefined;
      let hasDecorator = false;
      if (decorators) {
        for (const dec of decorators) {
          const exp = dec.expression;
          let name = '';
          if (ts.isIdentifier(exp)) {
            name = exp.text;
          } else if (
            ts.isCallExpression(exp) &&
            ts.isIdentifier(exp.expression)
          ) {
            name = exp.expression.text;
          }
          if (name === options.withDecorator) {
            hasDecorator = true;
          }
        }
      }
      return hasDecorator;
    });
  }
  if (options?.extending) {
    filtered = filtered.filter((c) => {
      if (c.heritageClauses) {
        for (const clause of c.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            for (const type of clause.types) {
              if (
                ts.isIdentifier(type.expression) &&
                type.expression.text === options.extending
              ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    });
  }
  if (options?.implementing) {
    filtered = filtered.filter((c) => {
      if (c.heritageClauses) {
        for (const clause of c.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
            for (const type of clause.types) {
              if (
                ts.isIdentifier(type.expression) &&
                type.expression.text === options.implementing
              ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    });
  }
  if (options?.havingModifier) {
    let targetKind: ts.SyntaxKind;
    switch (options.havingModifier) {
      case 'export':
        targetKind = ts.SyntaxKind.ExportKeyword;
        break;
      case 'default':
        targetKind = ts.SyntaxKind.DefaultKeyword;
        break;
      case 'abstract':
        targetKind = ts.SyntaxKind.AbstractKeyword;
        break;
      default:
        throw new Error(
          `Modifier ${options.havingModifier} is not fully supported.`,
        );
    }
    filtered = filtered.filter((c) => {
      const modifiers = ts.canHaveModifiers(c) ? ts.getModifiers(c) : undefined;
      return modifiers?.some((m: ts.Modifier) => m.kind === targetKind);
    });
  }

  return {
    type: 'ClassLocator',
    classes: filtered,
    program,
  };
}

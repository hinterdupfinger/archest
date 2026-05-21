import * as ts from 'typescript';
import { ArchestProject } from '@archest/core-rust';

import type {
  ClassData,
  FileData,
  FunctionData,
  ProjectData,
  PropertyData,
} from './dto';

export function createSourceFile(
  code: string,
  fileName = 'test.ts',
): ts.SourceFile {
  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
}

export function createMockProgram(sourceFiles: ts.SourceFile[]): ProjectData {
  return {
    files: sourceFiles.map((sf) => ({
      path: sf.fileName,
      classes: getClasses(sf),
      functions: getFunctions(sf),
      properties: getProperties(sf),
    })),
  };
}

export function createMockArchestProject(projectData: ProjectData): ArchestProject {
  return ArchestProject.parseMock(JSON.stringify(projectData));
}

export function getClasses(
  sourceFile: ts.SourceFile,
): (ClassData & { _filePath: string })[] {
  const classes: (ClassData & { _filePath: string })[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      let extendsName: string | null = null;
      const implementsNames: string[] = [];
      if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            for (const t of clause.types) {
              if (ts.isIdentifier(t.expression))
                extendsName = t.expression.text;
            }
          }
          if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
            for (const t of clause.types) {
              if (ts.isIdentifier(t.expression))
                implementsNames.push(t.expression.text);
            }
          }
        }
      }

      const decorators: string[] = [];
      if (ts.canHaveDecorators(node)) {
        const decs = ts.getDecorators(node);
        if (decs) {
          for (const d of decs) {
            if (ts.isIdentifier(d.expression))
              decorators.push(d.expression.text);
            else if (
              ts.isCallExpression(d.expression) &&
              ts.isIdentifier(d.expression.expression)
            )
              decorators.push(d.expression.expression.text);
          }
        }
      }

      classes.push({
        name: node.name?.text || null,
        is_exported: ts.canHaveModifiers(node)
          ? ts
              .getModifiers(node)
              ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false
          : false,
        is_default: ts.canHaveModifiers(node)
          ? ts
              .getModifiers(node)
              ?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) || false
          : false,
        is_abstract: ts.canHaveModifiers(node)
          ? ts
              .getModifiers(node)
              ?.some((m) => m.kind === ts.SyntaxKind.AbstractKeyword) || false
          : false,
        extends: extendsName,
        implements: implementsNames,
        decorators,
        _filePath: sourceFile.fileName,
      });
    }
  });
  return classes;
}

export function getFunctions(
  sourceFile: ts.SourceFile,
): (FunctionData & { _filePath: string })[] {
  const functions: (FunctionData & { _filePath: string })[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node)
    ) {
      let name: string | null = null;
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        name = node.name?.getText() || null;
      }

      functions.push({
        name,
        is_exported: ts.canHaveModifiers(node)
          ? ts
              .getModifiers(node)
              ?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false
          : false,
        is_async: ts.canHaveModifiers(node)
          ? ts
              .getModifiers(node)
              ?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) || false
          : false,
        is_top_level: true,
        has_explicit_return_type: !!(node as any).type,
        _filePath: sourceFile.fileName,
      });
    }
  });
  return functions;
}

export function getProperties(
  sourceFile: ts.SourceFile,
): (PropertyData & { _filePath: string })[] {
  const properties: (PropertyData & { _filePath: string })[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      node.members.forEach((member) => {
        if (ts.isPropertyDeclaration(member)) {
          properties.push({
            name: member.name.getText(),
            is_readonly: ts.canHaveModifiers(member)
              ? ts
                  .getModifiers(member)
                  ?.some((m) => m.kind === ts.SyntaxKind.ReadonlyKeyword) ||
                false
              : false,
            _filePath: sourceFile.fileName,
          });
        }
      });
    }
  });
  return properties;
}

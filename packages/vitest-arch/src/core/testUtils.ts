import * as ts from 'typescript';

export function createSourceFile(
  code: string,
  fileName = 'test.ts',
): ts.SourceFile {
  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true);
}

export function createMockProgram(sourceFiles: ts.SourceFile[]): ts.Program {
  const compilerOptions = {};
  const host = ts.createCompilerHost(compilerOptions);

  host.getSourceFile = (fileName) => {
    return sourceFiles.find((sf) => sf.fileName === fileName) || undefined;
  };

  return ts.createProgram({
    rootNames: sourceFiles.map((sf) => sf.fileName),
    options: compilerOptions,
    host: host,
  });
}

export function getClasses(sourceFile: ts.SourceFile): ts.ClassDeclaration[] {
  const classes: ts.ClassDeclaration[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) classes.push(node);
  });
  return classes;
}

export function getFunctions(
  sourceFile: ts.SourceFile,
): ts.FunctionLikeDeclaration[] {
  const functions: ts.FunctionLikeDeclaration[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node)
    ) {
      functions.push(node as ts.FunctionLikeDeclaration);
    }
  });
  return functions;
}

export function getProperties(
  sourceFile: ts.SourceFile,
): ts.PropertyDeclaration[] {
  const properties: ts.PropertyDeclaration[] = [];
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node)) {
      node.members.forEach((member) => {
        if (ts.isPropertyDeclaration(member)) properties.push(member);
      });
    }
  });
  return properties;
}

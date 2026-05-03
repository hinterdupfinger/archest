import * as ts from 'typescript';

export function getLayerDependencies(
  sourceFile: ts.SourceFile,
  program: ts.Program,
): string[] {
  const dependencies: string[] = [];
  const compilerOptions = program.getCompilerOptions();

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
      const resolved = ts.resolveModuleName(
        moduleSpecifier,
        sourceFile.fileName,
        compilerOptions,
        ts.sys,
      );
      if (
        resolved.resolvedModule?.resolvedFileName &&
        !resolved.resolvedModule.isExternalLibraryImport
      ) {
        dependencies.push(resolved.resolvedModule.resolvedFileName);
      }
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
      const resolved = ts.resolveModuleName(
        moduleSpecifier,
        sourceFile.fileName,
        compilerOptions,
        ts.sys,
      );
      if (
        resolved.resolvedModule?.resolvedFileName &&
        !resolved.resolvedModule.isExternalLibraryImport
      ) {
        dependencies.push(resolved.resolvedModule.resolvedFileName);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return dependencies;
}

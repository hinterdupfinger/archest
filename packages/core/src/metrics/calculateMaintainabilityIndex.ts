import * as ts from 'typescript';
import { calculateCyclomaticComplexity } from './calculateCyclomaticComplexity';

export function calculateMaintainabilityIndex(node: ts.Node): number {
  let operators = 0;
  let operands = 0;
  const uniqueOperators = new Set<number>();
  const uniqueOperands = new Set<string>();
  let linesOfCode = 1;

  const sourceFile = node.getSourceFile();
  if (sourceFile) {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    linesOfCode = end.line - start.line + 1;
  }

  const visit = (n: ts.Node) => {
    if (
      ts.isBinaryExpression(n) ||
      ts.isPrefixUnaryExpression(n) ||
      ts.isPostfixUnaryExpression(n)
    ) {
      operators++;
      uniqueOperators.add(n.kind);
    } else if (ts.isIdentifier(n) || ts.isLiteralExpression(n)) {
      operands++;
      uniqueOperands.add(n.getText(sourceFile));
    }
    ts.forEachChild(n, visit);
  };

  visit(node);

  const N = operators + operands;
  const n = uniqueOperators.size + uniqueOperands.size;
  const V = n === 0 ? 0 : N * Math.log2(n);
  const CC = calculateCyclomaticComplexity(node);

  const mi = Math.max(
    0,
    ((171 - 5.2 * Math.log(V || 1) - 0.23 * CC - 16.2 * Math.log(linesOfCode)) *
      100) /
      171,
  );
  return mi;
}

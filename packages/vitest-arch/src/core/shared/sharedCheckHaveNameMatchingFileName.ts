import * as path from 'node:path';
import * as ts from 'typescript';
import { buildRule } from '../utils/ruleBuilder';

export function sharedCheckHaveNameMatchingFileName<T extends ts.Node>(
  items: T[],
  getName: (item: T) => string | undefined,
  label: string,
  isNot: boolean,
) {
  return buildRule(items, isNot, (item) => {
    const name = getName(item);
    const sourceFile = item.getSourceFile
      ? item.getSourceFile()
      : item.parent
        ? ts.getSourceFileOfNode(item)
        : undefined;

    if (!sourceFile) {
      return { passes: true, failMessage: '', failNotMessage: '' };
    }

    const basename = path.basename(
      sourceFile.fileName,
      path.extname(sourceFile.fileName),
    );
    const passes = name === basename;
    const desc = `${label} ${name || 'Anonymous'}`;

    return {
      passes,
      failMessage: `${desc} does not have a name matching its filename ${basename}, but it should.`,
      failNotMessage: `${desc} has a name matching its filename ${basename}, but it shouldn't.`,
    };
  });
}

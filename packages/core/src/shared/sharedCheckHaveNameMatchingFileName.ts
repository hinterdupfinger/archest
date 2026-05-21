import * as path from 'node:path';
import { ruleBuilder } from '../utils/ruleBuilder';

export function sharedCheckHaveNameMatchingFileName<
  T extends { _filePath: string },
>(
  items: T[],
  getName: (item: T) => string | null | undefined,
  label: string,
  isNot: boolean,
) {
  return ruleBuilder(items, isNot, (item) => {
    const name = getName(item);

    if (!item._filePath) {
      return { passes: true, failMessage: '', failNotMessage: '' };
    }

    const basename = path.basename(
      item._filePath,
      path.extname(item._filePath),
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

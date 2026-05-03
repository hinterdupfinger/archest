import { ruleBuilder } from '../utils/ruleBuilder';

export function sharedCheckHaveMinMaintainabilityIndex<T>(
  items: T[],
  getName: (item: T) => string | undefined,
  getMi: (item: T) => number,
  label: string,
  min: number,
  isNot: boolean,
) {
  return ruleBuilder(items, isNot, (item) => {
    const name = getName(item);
    const mi = getMi(item);
    const fallsBelow = mi < min;
    const desc = `${label} ${name || 'Anonymous'}`;

    return {
      passes: !fallsBelow,
      failMessage: `${desc} has a maintainability index of ${mi.toFixed(2)}, which falls below the minimum of ${min}.`,
      failNotMessage: `${desc} has a maintainability index of ${mi.toFixed(2)}, which falls below the minimum of ${min}, but it shouldn't.`,
    };
  });
}

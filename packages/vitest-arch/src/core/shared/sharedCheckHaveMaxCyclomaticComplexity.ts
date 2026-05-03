import { buildRule } from '../utils/ruleBuilder';

export function sharedCheckHaveMaxCyclomaticComplexity<T>(
  items: T[],
  getName: (item: T) => string | undefined,
  getComplexity: (item: T) => number,
  label: string,
  max: number,
  isNot: boolean,
) {
  return buildRule(items, isNot, (item) => {
    const name = getName(item);
    const complexity = getComplexity(item);
    const exceeds = complexity > max;
    const desc = `${label} ${name || 'Anonymous'}`;

    return {
      passes: !exceeds,
      failMessage: `${desc} has a total cyclomatic complexity of ${complexity}, which exceeds the maximum of ${max}.`,
      failNotMessage: `${desc} has a total cyclomatic complexity of ${complexity}, which exceeds the maximum of ${max}, but it shouldn't.`,
    };
  });
}

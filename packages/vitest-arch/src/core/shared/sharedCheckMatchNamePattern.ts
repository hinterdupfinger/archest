import { ruleBuilder } from '../utils/ruleBuilder';

export function sharedCheckMatchNamePattern<T>(
  items: T[],
  getName: (item: T) => string | undefined,
  label: string,
  pattern: string | RegExp,
  isNot: boolean,
) {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  return ruleBuilder(items, isNot, (item) => {
    const name = getName(item);
    const passes = name ? regex.test(name) : false;
    const desc = `${label} ${name || 'Anonymous'}`;
    return {
      passes,
      failMessage: `${desc} does not match pattern ${pattern}, but it should.`,
      failNotMessage: `${desc} matches pattern ${pattern}, but it shouldn't.`,
    };
  });
}

import type { RuleResult } from '../types';

export function buildRule<T>(
  items: T[],
  isNot: boolean,
  evaluate: (item: T) => {
    passes: boolean;
    failMessage: string;
    failNotMessage: string;
  },
): RuleResult {
  const violations: string[] = [];

  for (const item of items) {
    const { passes, failMessage, failNotMessage } = evaluate(item);

    if (isNot && passes) {
      if (failNotMessage) violations.push(failNotMessage);
    } else if (!isNot && !passes) {
      if (failMessage) violations.push(failMessage);
    }
  }

  return {
    pass: violations.length === 0,
    message: () => violations.join('\n'),
  };
}

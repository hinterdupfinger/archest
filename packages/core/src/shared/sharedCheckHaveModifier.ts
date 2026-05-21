import { ruleBuilder } from '../utils/ruleBuilder';

export function sharedCheckHaveModifier<
  T extends {
    is_exported?: boolean;
    is_default?: boolean;
    is_abstract?: boolean;
    is_async?: boolean;
    is_readonly?: boolean;
  },
>(
  items: T[],
  getName: (item: T) => string | null | undefined,
  label: string,
  modifierStr: string,
  isNot: boolean,
) {
  return ruleBuilder(items, isNot, (item) => {
    const name = getName(item);
    let passes = false;
    switch (modifierStr) {
      case 'export':
        passes = !!item.is_exported;
        break;
      case 'default':
        passes = !!item.is_default;
        break;
      case 'abstract':
        passes = !!item.is_abstract;
        break;
      case 'async':
        passes = !!item.is_async;
        break;
      case 'readonly':
        passes = !!item.is_readonly;
        break;
      default:
        throw new Error(`Modifier ${modifierStr} is not fully supported.`);
    }

    const desc = `${label} ${name || 'Anonymous'}`;

    return {
      passes,
      failMessage: `${desc} does not have modifier ${modifierStr}, but it should.`,
      failNotMessage: `${desc} has modifier ${modifierStr}, but it shouldn't.`,
    };
  });
}

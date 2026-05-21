import type { ClassData, ProjectData } from '../dto';
import type { ClassLocatorData, ClassQueryOptions } from './types';

export function locateClasses(
  classes: (ClassData & { _filePath: string })[],
  projectData: ProjectData,
  options?: ClassQueryOptions,
): ClassLocatorData {
  let filtered = classes;

  if (options?.inFolder) {
    filtered = filtered.filter((c) => {
      return (
        c._filePath.includes(`/${options.inFolder}/`) ||
        c._filePath.includes(`\\${options.inFolder}\\`)
      );
    });
  }
  if (options?.matchNamePattern) {
    const regex =
      typeof options.matchNamePattern === 'string'
        ? new RegExp(options.matchNamePattern)
        : options.matchNamePattern;
    filtered = filtered.filter((c) => {
      return c.name && regex.test(c.name);
    });
  }
  if (options?.withDecorator) {
    filtered = filtered.filter((c) => {
      return c.decorators.includes(options.withDecorator!);
    });
  }
  if (options?.extending) {
    filtered = filtered.filter((c) => {
      return c.extends === options.extending;
    });
  }
  if (options?.implementing) {
    filtered = filtered.filter((c) => {
      return c.implements.includes(options.implementing!);
    });
  }
  if (options?.havingModifier) {
    filtered = filtered.filter((c) => {
      switch (options.havingModifier) {
        case 'export':
          return c.is_exported;
        case 'default':
          return c.is_default;
        case 'abstract':
          return c.is_abstract;
        default:
          throw new Error(
            `Modifier ${options.havingModifier} is not fully supported.`,
          );
      }
    });
  }

  return {
    type: 'ClassLocator',
    classes: filtered,
    projectData,
  };
}

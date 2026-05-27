import type { ClassData, ProjectData } from '../dto';
import { getCommonPrefix, isFileInFolder } from '../utils/paths';
import type { ClassLocatorData, ClassQueryOptions } from './types';

export function locateClasses(
  classes: (ClassData & { _filePath: string })[],
  projectData: ProjectData,
  options?: ClassQueryOptions,
): ClassLocatorData {
  let filtered = classes;

  if (options?.inFolder) {
    const filePaths = classes.map((c) => c._filePath);
    const projectRoot = projectData.projectRoot || getCommonPrefix(filePaths);
    filtered = filtered.filter((c) =>
      // biome-ignore lint/style/noNonNullAssertion: options.inFolder is checked in the outer if block
      isFileInFolder(c._filePath, projectRoot, options.inFolder!),
    );
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
    const decorator = options.withDecorator;
    filtered = filtered.filter((c) => {
      return c.decorators.includes(decorator);
    });
  }
  if (options?.extending) {
    filtered = filtered.filter((c) => {
      return c.extends === options.extending;
    });
  }
  if (options?.implementing) {
    const implementing = options.implementing;
    filtered = filtered.filter((c) => {
      return c.implements.includes(implementing);
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

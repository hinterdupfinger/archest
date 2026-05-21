import { describe, expect, it } from 'vitest';
import type { ProjectData } from '../dto';
import { checkDependOnExternalModule } from './checkDependOnExternalModule';
import type { FileLocatorData } from './types';

describe('checkDependOnExternalModule', () => {
  const mockProjectData: ProjectData = {
    files: [
      {
        path: 'src/graphql/client.ts',
        external_dependencies: ['gql-tada', 'vue'],
        dependencies: [],
        classes: [],
        functions: [],
        properties: [],
      },
      {
        path: 'src/components/List.vue',
        external_dependencies: ['vue'],
        dependencies: ['../graphql/client.ts'],
        classes: [],
        functions: [],
        properties: [],
      },
    ],
  };

  const locator: FileLocatorData = {
    type: 'FileLocator',
    projectData: mockProjectData,
    files: [mockProjectData.files[0]],
  };

  const componentsLocator: FileLocatorData = {
    type: 'FileLocator',
    projectData: mockProjectData,
    files: [mockProjectData.files[1]],
  };

  it('passes when file correctly depends on external module', () => {
    const result = checkDependOnExternalModule(locator, 'gql-tada', false);
    expect(result.pass).toBe(true);
  });

  it('fails when file does not depend on required external module', () => {
    const result = checkDependOnExternalModule(
      componentsLocator,
      'gql-tada',
      false,
    );
    expect(result.pass).toBe(false);
    expect(result.message()).toContain(
      "src/components/List.vue does not depend on external module 'gql-tada'",
    );
  });

  it('passes when asserting NOT to depend and it does not', () => {
    const result = checkDependOnExternalModule(
      componentsLocator,
      'gql-tada',
      true,
    );
    expect(result.pass).toBe(true);
  });

  it('fails when asserting NOT to depend but it does', () => {
    const result = checkDependOnExternalModule(locator, 'gql-tada', true);
    expect(result.pass).toBe(false);
    expect(result.message()).toContain(
      "src/graphql/client.ts incorrectly depends on external module 'gql-tada'",
    );
  });
});

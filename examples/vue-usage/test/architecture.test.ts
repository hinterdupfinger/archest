import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('Vue Architecture Rules', () => {
  const project = parseProject();

  describe('Composables', () => {
    it('composables should be exported functions starting with use', () => {
      const useFunctions = project.getFunctions({
        inFolder: 'composables',
        isTopLevel: true,
      });
      expect(useFunctions).toHaveModifier('export');

      const fileNames = useFunctions.functions.map((f) => f.name);
      fileNames.forEach((name) => {
        if (name) expect(name).toMatch(/^use/);
      });
    });
  });

  describe('Components: Smart vs Dumb', () => {
    it('dumb ui components should not interact with graphql or store', () => {
      const uiComponents = project.getFiles({ inFolder: 'components/ui' });
      expect(uiComponents).not.toDependOnFilesInFolder('store');
      expect(uiComponents).not.toDependOnFilesInFolder('graphql');
    });

    it('feature components can interact with graphql but must colocate fragments', () => {
      // Find all TypeScript files in src that import from our graphql setup
      const allFiles = project.getFiles({
        inFolder: 'src',
        matchNamePattern: /.*\.ts$/,
      }).files;
      const filesImportingGraphql = allFiles.filter((file) => {
        return file.dependencies.some(dep => dep.includes('graphql/setup'));
      });

      // Use our new matcher to ensure they follow the strict naming convention!
      // (They must either be the setup file itself, or end in .graphql.ts)
      const locator = {
        type: 'FileLocator' as const,
        files: filesImportingGraphql,
        projectData: (project as any).projectData,
        archestProject: (project as any).archestProject,
      };

      expect(locator).toMatchNamePattern(/(\.graphql\.ts$|setup\.ts$)/);

      // Ensure all .graphql.ts files reside in components/features
      const graphqlFiles = project.getFiles({
        matchNamePattern: /.*\.graphql\.ts$/,
      });
      expect(graphqlFiles).toMatchNamePattern(/components\/features/);
    });
  });
});

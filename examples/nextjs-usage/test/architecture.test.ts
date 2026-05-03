import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('Next.js Hexagonal Architecture Rules', () => {
  const project = parseProject();

  describe('Core Hexagon (Ports & Adapters)', () => {
    it('should respect layer boundaries (inbound access)', () => {
      const architecture = project
        .layeredArchitecture()
        .layer('Domain', 'core/domain')
        .layer('Ports', 'core/ports')
        .layer('Application', 'core/application')
        .layer('Infrastructure', 'infrastructure/adapters')
        .layer('Actions', 'app/actions')
        .layer('Features', 'components/features');

      // Ports are implemented by Infrastructure and used by Application
      expect(
        architecture
          .whereLayer('Ports')
          .shouldOnlyBeAccessedBy('Application', 'Infrastructure')
          .check(),
      ).toPass();

      // Application use cases should only be accessed by Actions or Features
      expect(
        architecture
          .whereLayer('Application')
          .shouldOnlyBeAccessedBy('Actions', 'Features')
          .check(),
      ).toPass();

      // Infrastructure adapters should ONLY be accessed by the composition root (Actions)
      expect(
        architecture
          .whereLayer('Infrastructure')
          .shouldOnlyBeAccessedBy('Actions')
          .check(),
      ).toPass();
    });

    it('domain should have zero outbound dependencies to other layers', () => {
      const domain = project.getFiles({ inFolder: 'core/domain' });
      expect(domain).not.toDependOnFilesInFolder('core/ports');
      expect(domain).not.toDependOnFilesInFolder('core/application');
      expect(domain).not.toDependOnFilesInFolder('infrastructure');
      expect(domain).not.toDependOnFilesInFolder('app');
      expect(domain).not.toDependOnFilesInFolder('components');
    });
  });

  describe('Server Actions', () => {
    it('all functions in the app/actions folder must be async and exported', () => {
      const actions = project.getFunctions({ inFolder: 'app/actions' });
      expect(actions).toHaveModifier('async');
      expect(actions).toHaveModifier('export');
    });

    it('server actions can act as the composition root, but must not depend on UI', () => {
      const actionFiles = project.getFiles({ inFolder: 'app/actions' });
      expect(actionFiles).not.toDependOnFilesInFolder('components/ui');
    });
  });

  describe('Components: Smart vs Dumb', () => {
    it('ui components (dumb) should be pure and not depend on actions, features, or core logic', () => {
      const uiComponents = project.getFiles({ inFolder: 'components/ui' });

      expect(uiComponents).not.toDependOnFilesInFolder('app/actions');
      expect(uiComponents).not.toDependOnFilesInFolder('core/application');
      expect(uiComponents).not.toDependOnFilesInFolder('infrastructure');
      expect(uiComponents).not.toDependOnFilesInFolder('components/features');
    });

    it('ui components should be exported', () => {
      const uiFunctions = project.getFunctions({ inFolder: 'components/ui' });
      expect(uiFunctions).toHaveModifier('export');
    });

    it('feature components (smart) should not depend on infrastructure directly', () => {
      const featureComponents = project.getFiles({
        inFolder: 'components/features',
      });
      expect(featureComponents).not.toDependOnFilesInFolder(
        'infrastructure/adapters',
      );
    });
  });

  describe('Pages', () => {
    it('pages should be exported', () => {
      const pages = project.getFunctions({
        inFolder: 'app',
        matchNamePattern: /^Page$/,
      });
      // FunctionLocator does not support 'default' out of the box, but we can verify it's exported
      expect(pages).toHaveModifier('export');
    });
  });
});

import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('NestJS Architecture Rules', () => {
  const project = parseProject();

  describe('Controllers', () => {
    const controllers = project.getClasses({ matchNamePattern: /Controller$/ });

    it('should reside in the controllers folder', () => {
      expect(controllers).toResideInFolder('controllers');
    });

    it('should be exported', () => {
      expect(controllers).toHaveModifier('export');
    });

    it('should be decorated with @Controller', () => {
      const decorated = project.getClasses({ withDecorator: 'Controller' });
      expect(decorated).toMatchNamePattern(/Controller$/);
    });
  });

  describe('Services', () => {
    const services = project.getClasses({ matchNamePattern: /Service$/ });

    it('should reside in the services folder', () => {
      expect(services).toResideInFolder('services');
    });

    it('should be decorated with @Injectable', () => {
      const decorated = project.getClasses({ withDecorator: 'Injectable' });
      expect(decorated).toMatchNamePattern(/Service$/);
    });
  });

  describe('Data Transfer Objects (DTOs)', () => {
    const dtos = project.getClasses({ matchNamePattern: /Dto$/ });

    it('should reside in the dto folder', () => {
      expect(dtos).toResideInFolder('dto');
    });

    it('should only contain readonly properties for immutability', () => {
      const dtoProps = project.getProperties({ inFolder: 'dto' });
      expect(dtoProps).toBeReadonly();
    });
  });

  describe('Layered Architecture', () => {
    it('should respect N-Tier access rules', () => {
      const architecture = project
        .layeredArchitecture()
        .layer('Controllers', 'controllers')
        .layer('Services', 'services')
        .layer('DTOs', 'dto');

      // Controllers should not be accessed by Services or DTOs
      expect(
        architecture
          .whereLayer('Controllers')
          .shouldNotBeAccessedByAnyLayer()
          .check(),
      ).toPass();

      // Services should not be accessed by DTOs
      expect(
        architecture
          .whereLayer('Services')
          .shouldOnlyBeAccessedBy('Controllers')
          .check(),
      ).toPass();
    });
  });
});

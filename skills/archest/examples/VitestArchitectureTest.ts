import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('Application Layer Architecture', () => {
  const project = parseProject({
    exclude: ['**/*.test.ts', 'dist/**'],
  });

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });

  it('services should be named Service', () => {
    const services = project.getClasses({ inFolder: 'services' });
    expect(services).toMatchNamePattern(/Service$/);
  });
});

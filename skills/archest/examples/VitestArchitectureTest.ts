import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('Application Layer Architecture', () => {
  const project = parseProject({
    exclude: ['**/*.test.ts', 'dist/**'],
  });

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    const infra = project.getFiles({ inFolder: 'infrastructure' });

    // Counter-checks: ensure both boundaries exist and contain files
    expect(domain.files.length).toBeGreaterThan(0);
    expect(infra.files.length).toBeGreaterThan(0);

    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });

  it('services should be named Service', () => {
    const services = project.getClasses({ inFolder: 'services' });

    // Counter-check: ensure services were discovered
    expect(services.classes.length).toBeGreaterThan(0);

    expect(services).toMatchNamePattern(/Service$/);
  });

  it('feature slices must be free of cycles', () => {
    const slices = project.getSlices('src/modules/*');

    // Counter-check: ensure slices were matched
    expect(slices.slices.length).toBeGreaterThan(0);

    expect(slices).toBeFreeOfCycles();
  });
});

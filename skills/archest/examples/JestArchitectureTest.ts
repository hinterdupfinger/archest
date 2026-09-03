import { parseProject, setupMatchers } from '@archest/jest';

setupMatchers();

describe('Application Layer Architecture (Jest)', () => {
  const project = parseProject({
    exclude: ['**/*.test.ts', 'dist/**'],
  });

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    const infra = project.getFiles({ inFolder: 'infrastructure' });

    // Counter-checks: ensure selectors found files
    expect(domain.files.length).toBeGreaterThan(0);
    expect(infra.files.length).toBeGreaterThan(0);

    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });
});

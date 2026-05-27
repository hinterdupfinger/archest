import { parseProject, setupMatchers } from '@archest/jest';

setupMatchers();

describe('Application Layer Architecture (Jest)', () => {
  const project = parseProject({
    exclude: ['**/*.test.ts', 'dist/**'],
  });

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });
});

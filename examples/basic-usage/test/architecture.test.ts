import * as path from 'node:path';
import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, expect, it } from 'vitest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject(path.join(__dirname, '../tsconfig.json'));

  it('services should not depend on controllers', () => {
    const services = project.getFiles({ inFolder: 'services' });
    expect(services).not.toDependOnFilesInFolder('controllers');
  });

  it('Controller classes should reside in controllers folder', () => {
    const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
    expect(controllers).toResideInFolder('controllers');
  });

  it('Architecture should be free of cycles', () => {
    const srcFiles = project.getFiles({ inFolder: 'src' });
    expect(srcFiles).toBeFreeOfCycles();
  });
});

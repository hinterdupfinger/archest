import { join } from 'node:path';
import { parseProject } from '@archest/core';

describe('Advanced Architecture Tests', () => {
  const project = parseProject({
    tsConfigFilePath: join(__dirname, '../tsconfig.json'),
  });

  describe('Functions', () => {
    it('top-level functions in services should be exported', () => {
      const fns = project.getFunctions({
        inFolder: 'services',
        isTopLevel: true,
      });
      expect(fns).toHaveModifier('export');
    });

    it('all functions in services should have explicit return type', () => {
      const fns = project.getFunctions({ inFolder: 'services' });
      expect(fns).toHaveExplicitReturnType();
    });
  });

  describe('Properties', () => {
    it('id property should be readonly', () => {
      const props = project.getProperties({
        inFolder: 'services',
        matchNamePattern: /^id$/,
      });
      expect(props).toBeReadonly();
    });

    it('secret property should not be readonly', () => {
      const props = project.getProperties({
        inFolder: 'services',
        matchNamePattern: /^secret$/,
      });
      expect(props).not.toBeReadonly();
    });
  });

  describe('Slices', () => {
    it('features should be free of cycles', () => {
      const slices = project.getSlices('src/features/*');
      expect(slices).toBeFreeOfCycles();
    });
  });
});

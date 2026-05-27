import { describe, expect, it } from 'vitest';
import { parseProject } from './parseProject';

describe('parseProject', () => {
  it('should parse the current project correctly', () => {
    // Running from within vitest-arch, it should pick up the tsconfig
    const project = parseProject();
    expect(project).toHaveProperty('getFiles');
    expect(project).toHaveProperty('getClasses');
    expect(project).toHaveProperty('getFunctions');
    expect(project).toHaveProperty('layeredArchitecture');
    expect(project).toHaveProperty('getSlices');

    // Verify it can get its own files
    const coreFiles = project.getFiles({ inFolder: 'src' });
    expect(coreFiles.files.length).toBeGreaterThan(0);
    expect(coreFiles.type).toBe('FileLocator');
  });
});

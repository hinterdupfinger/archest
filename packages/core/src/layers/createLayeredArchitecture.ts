import type { FileData, ProjectData } from '../dto';
import type { LayeredArchitectureData } from './types';

export function createLayeredArchitecture(
  files: FileData[],
  projectData: ProjectData,
): LayeredArchitectureData {
  return {
    type: 'LayeredArchitecture',
    files,
    layers: new Map<string, string>(),
    assertions: [],
    projectData,
  };
}

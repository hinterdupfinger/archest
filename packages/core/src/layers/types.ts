import type { FileData, ProjectData } from '../dto';

export interface LayeredArchitectureData {
  type: 'LayeredArchitecture';
  files: FileData[];
  layers: Map<string, string>;
  assertions: Array<(files: FileData[]) => string[]>;
  projectData: ProjectData;
}

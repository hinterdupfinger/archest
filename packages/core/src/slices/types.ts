import type { FileData, ProjectData } from '../dto';

export interface SliceLocatorData {
  type: 'SliceLocator';
  slicePattern: RegExp;
  sliceIds: Set<string>;
  sliceFiles: Map<string, FileData[]>;
  projectData: ProjectData;
}

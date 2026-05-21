import type { FileData, ProjectData } from '../dto';

export function getLayerDependencies(
  sourceFile: FileData,
  _projectData: ProjectData,
): string[] {
  return sourceFile.dependencies || [];
}

import type { FileData, ProjectData } from '../dto';

export function getLayerDependencies(
  sourceFile: FileData,
  projectData: ProjectData,
): string[] {
  return sourceFile.dependencies || [];
}

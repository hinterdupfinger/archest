import type { FileData, ProjectData } from '../dto';

export function getFileDependencies(
  sourceFile: FileData,
  _projectData: ProjectData,
): string[] {
  return sourceFile.dependencies || [];
}

import type { FileData, ProjectData } from '../dto';

export function getFileDependencies(
  sourceFile: FileData,
  projectData: ProjectData,
): string[] {
  return sourceFile.dependencies || [];
}

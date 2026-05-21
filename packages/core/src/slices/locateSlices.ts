import type { FileData, ProjectData } from '../dto';
import type { SliceLocatorData } from './types';

export function locateSlices(
  sourceFiles: FileData[],
  projectData: ProjectData,
  pattern: string,
): SliceLocatorData {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped.replace(/\*/g, '([^/\\\\]+)');
  const slicePattern = new RegExp(regexStr);

  const sliceIds = new Set<string>();
  const sliceFiles = new Map<string, FileData[]>();

  for (const sf of sourceFiles) {
    const match = sf.path.match(slicePattern);
    if (match?.[1]) {
      const sliceId = match[1];
      sliceIds.add(sliceId);
      if (!sliceFiles.has(sliceId)) {
        sliceFiles.set(sliceId, []);
      }
      sliceFiles.get(sliceId)?.push(sf);
    }
  }

  return {
    type: 'SliceLocator',
    slicePattern,
    sliceIds,
    sliceFiles,
    projectData,
  };
}

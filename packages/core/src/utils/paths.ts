export function getCommonPrefix(paths: string[]): string {
  if (paths.length === 0) return '';
  const sorted = [...paths].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  let i = 0;
  while (i < first.length && first[i] === last[i]) {
    i++;
  }
  const prefix = first.substring(0, i);
  const lastSlash = Math.max(prefix.lastIndexOf('/'), prefix.lastIndexOf('\\'));
  return lastSlash === -1 ? '' : prefix.substring(0, lastSlash + 1);
}

export function isFileInFolder(
  filePath: string,
  projectRoot: string,
  inFolder: string,
): boolean {
  let relativePath = filePath
    .substring(projectRoot.length)
    .replace(/\\/g, '/')
    .replace(/^\//, '');
  const targetFolder = inFolder
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace(/\/$/, '');
  if (
    relativePath.startsWith('src/') &&
    !targetFolder.startsWith('src/') &&
    targetFolder !== 'src'
  ) {
    relativePath = relativePath.substring(4);
  }
  return (
    relativePath.startsWith(`${targetFolder}/`) || relativePath === targetFolder
  );
}

export function hasPathSegment(
  filePath: string,
  targetFolder: string,
): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedTarget = targetFolder
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace(/\/$/, '');
  const segments = normalizedPath.split('/');
  const targetSegments = normalizedTarget.split('/');
  return segments.some((_, i) =>
    targetSegments.every((seg, j) => segments[i + j] === seg),
  );
}

export function getBasename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash === -1 ? normalized : normalized.substring(lastSlash + 1);
}

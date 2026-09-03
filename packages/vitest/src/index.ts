// 1. Core API

// 3. Locator Query Options
// 4. Shared DTOs
export type {
  ClassData,
  ClassQueryOptions,
  FileData,
  FileQueryOptions,
  FunctionData,
  FunctionQueryOptions,
  ProjectData,
  PropertyData,
  PropertyQueryOptions,
} from '@archest/core';
export {
  type ParseProjectOptions,
  parseProject,
} from '@archest/core';
// 2. Vitest Integrations
export { type ArchestMatchers, setupMatchers } from './matchers';

import type { ArchestMatchers } from './matchers';

declare module 'vitest' {
  interface Assertion<R extends void | Promise<void> = void, T = unknown>
    extends ArchestMatchers<R> {}
  // biome-ignore lint/suspicious/noExplicitAny: Matcher signature
  interface AsymmetricMatchersContaining extends ArchestMatchers<any> {}
}

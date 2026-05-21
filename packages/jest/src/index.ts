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
// 2. Jest Integrations
export { type ArchestMatchers, setupMatchers } from './matchers';

import type { ArchestMatchers } from './matchers';

declare global {
  namespace jest {
    interface Matchers<R> extends ArchestMatchers<R> {}
  }
}

// 1. Core API
export {
  parseProject,
  type ParseProjectOptions,
} from '@archest/core';

// 2. Vitest Integrations
export { setupMatchers, type ArchestMatchers } from './matchers';

// 3. Locator Query Options
export type {
  ClassQueryOptions,
  FileQueryOptions,
  FunctionQueryOptions,
  PropertyQueryOptions,
} from '@archest/core';

// 4. Shared DTOs
export type {
  ProjectData,
  FileData,
  ClassData,
  FunctionData,
  PropertyData,
} from '@archest/core';

import type { ClassLocatorData } from './classes/types';
import type { FileLocatorData } from './files/types';
import type { FunctionLocatorData } from './functions/types';
import type { LayeredArchitectureData } from './layers/types';
import type { PropertyLocatorData } from './properties/types';
import type { SliceLocatorData } from './slices/types';

export interface RuleResult {
  pass: boolean;
  message: () => string;
}

export type LocatorData =
  | FileLocatorData
  | ClassLocatorData
  | FunctionLocatorData
  | PropertyLocatorData
  | SliceLocatorData
  | LayeredArchitectureData;

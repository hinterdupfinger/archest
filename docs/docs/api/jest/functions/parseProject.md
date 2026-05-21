[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / parseProject

# Function: parseProject()

> **parseProject**(`options?`): `object`

Defined in: core/dist/project/parseProject.d.ts:39

The primary entry point for Archest. Parses a TypeScript or JavaScript project into a searchable
Abstract Syntax Tree (AST) using the high-performance native Rust engine.

## Parameters

### options?

[`ParseProjectOptions`](../interfaces/ParseProjectOptions.md)

Optional configuration for locating the tsconfig and filtering files.

## Returns

`object`

A fluent API object containing Locators used to query the project's architecture.

### getClasses

> **getClasses**: (`queryOptions?`) => `ClassLocatorData`

#### Parameters

##### queryOptions?

[`ClassQueryOptions`](../interfaces/ClassQueryOptions.md)

#### Returns

`ClassLocatorData`

### getFiles

> **getFiles**: (`queryOptions?`) => `FileLocatorData`

#### Parameters

##### queryOptions?

[`FileQueryOptions`](../interfaces/FileQueryOptions.md)

#### Returns

`FileLocatorData`

### getFunctions

> **getFunctions**: (`queryOptions?`) => `FunctionLocatorData`

#### Parameters

##### queryOptions?

[`FunctionQueryOptions`](../interfaces/FunctionQueryOptions.md)

#### Returns

`FunctionLocatorData`

### getProperties

> **getProperties**: (`queryOptions?`) => `PropertyLocatorData`

#### Parameters

##### queryOptions?

[`PropertyQueryOptions`](../interfaces/PropertyQueryOptions.md)

#### Returns

`PropertyLocatorData`

### getSlices

> **getSlices**: (`pattern`) => `SliceLocatorData`

#### Parameters

##### pattern

`string`

#### Returns

`SliceLocatorData`

### layeredArchitecture

> **layeredArchitecture**: () => `object`

#### Returns

`object`

##### check

> **check**: () => `RuleResult`

###### Returns

`RuleResult`

##### data

> `readonly` **data**: `LayeredArchitectureData`

##### layer

> **layer**: (`name`, `folderPattern`) => `any`

###### Parameters

###### name

`string`

###### folderPattern

`string`

###### Returns

`any`

##### whereLayer

> **whereLayer**: (`name`) => `object`

###### Parameters

###### name

`string`

###### Returns

`object`

###### shouldNotBeAccessedByAnyLayer

> **shouldNotBeAccessedByAnyLayer**: () => `any`

###### Returns

`any`

###### shouldOnlyBeAccessedBy

> **shouldOnlyBeAccessedBy**: (...`allowedLayers`) => `any`

###### Parameters

###### allowedLayers

...`string`[]

###### Returns

`any`

### projectData

> **projectData**: [`ProjectData`](../interfaces/ProjectData.md)

## Example

```typescript
import { parseProject } from '@archest/vitest';

const project = parseProject({
  include: ['src/domain/**/*.ts'],
  exclude: ['**/*.test.ts']
});

const domainFiles = project.getFiles();
```

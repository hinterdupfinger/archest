[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / FileData

# Interface: FileData

Defined in: core/dist/dto.d.ts:15

Represents a single source file in the project.
Contains information about its path, dependencies, and all nested code blocks.

## Properties

### classes

> **classes**: [`ClassData`](ClassData.md)[]

Defined in: core/dist/dto.d.ts:19

An array of all classes defined within this file.

***

### dependencies?

> `optional` **dependencies?**: `string`[]

Defined in: core/dist/dto.d.ts:25

An array of raw module paths this file imports (e.g., './utils', 'react').

***

### external\_dependencies?

> `optional` **external\_dependencies?**: `string`[]

Defined in: core/dist/dto.d.ts:27

An array of external module imports (e.g., 'react', 'lodash').

***

### external\_type\_dependencies?

> `optional` **external\_type\_dependencies?**: `string`[]

Defined in: core/dist/dto.d.ts:31

An array of external type-only module imports.

***

### functions

> **functions**: [`FunctionData`](FunctionData.md)[]

Defined in: core/dist/dto.d.ts:21

An array of all top-level or exported functions defined within this file.

***

### path

> **path**: `string`

Defined in: core/dist/dto.d.ts:17

The absolute path to the file.

***

### properties

> **properties**: [`PropertyData`](PropertyData.md)[]

Defined in: core/dist/dto.d.ts:23

An array of properties extracted from classes or objects in the file.

***

### type\_dependencies?

> `optional` **type\_dependencies?**: `string`[]

Defined in: core/dist/dto.d.ts:29

An array of type-only module paths this file imports.

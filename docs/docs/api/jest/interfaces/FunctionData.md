[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / FunctionData

# Interface: FunctionData

Defined in: core/dist/dto.d.ts:52

Represents a function declaration or arrow function extracted from a file.

## Properties

### cyclomatic\_complexity?

> `optional` **cyclomatic\_complexity?**: `number`

Defined in: core/dist/dto.d.ts:64

The computed McCabe cyclomatic complexity of the function body.

***

### has\_explicit\_return\_type

> **has\_explicit\_return\_type**: `boolean`

Defined in: core/dist/dto.d.ts:62

True if the function explicitly declares a return type.

***

### is\_async

> **is\_async**: `boolean`

Defined in: core/dist/dto.d.ts:58

True if the function is marked as async.

***

### is\_exported

> **is\_exported**: `boolean`

Defined in: core/dist/dto.d.ts:56

True if the function is exported from the file.

***

### is\_top\_level

> **is\_top\_level**: `boolean`

Defined in: core/dist/dto.d.ts:60

True if the function is defined at the root level of the file context.

***

### maintainability\_index?

> `optional` **maintainability\_index?**: `number`

Defined in: core/dist/dto.d.ts:66

The computed Halstead maintainability index (0-100).

***

### name

> **name**: `string` \| `null`

Defined in: core/dist/dto.d.ts:54

The name of the function, or null if anonymous.

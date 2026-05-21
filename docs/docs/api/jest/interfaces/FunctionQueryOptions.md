[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / FunctionQueryOptions

# Interface: FunctionQueryOptions

Defined in: core/dist/functions/types.d.ts:12

Options to filter functions when querying the AST via `getFunctions()`.

## Properties

### inFolder?

> `optional` **inFolder?**: `string`

Defined in: core/dist/functions/types.d.ts:14

Filters functions to only include those residing in a specific folder path.

***

### isTopLevel?

> `optional` **isTopLevel?**: `boolean`

Defined in: core/dist/functions/types.d.ts:18

Filters functions to only include top-level functions (not nested or methods).

***

### matchNamePattern?

> `optional` **matchNamePattern?**: `string` \| `RegExp`

Defined in: core/dist/functions/types.d.ts:16

Filters functions by a string or RegExp matching their name.

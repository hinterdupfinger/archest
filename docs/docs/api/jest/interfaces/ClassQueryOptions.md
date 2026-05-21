[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / ClassQueryOptions

# Interface: ClassQueryOptions

Defined in: core/dist/classes/types.d.ts:12

Options to filter classes when querying the AST via `getClasses()`.

## Properties

### extending?

> `optional` **extending?**: `string`

Defined in: core/dist/classes/types.d.ts:20

Filters classes to only include those extending the specified base class.

***

### havingModifier?

> `optional` **havingModifier?**: `string`

Defined in: core/dist/classes/types.d.ts:24

Filters classes to only include those with the specified AST modifier (e.g., 'export', 'abstract').

***

### implementing?

> `optional` **implementing?**: `string`

Defined in: core/dist/classes/types.d.ts:22

Filters classes to only include those implementing the specified interface.

***

### inFolder?

> `optional` **inFolder?**: `string`

Defined in: core/dist/classes/types.d.ts:14

Filters classes to only include those residing in a specific folder path.

***

### matchNamePattern?

> `optional` **matchNamePattern?**: `string` \| `RegExp`

Defined in: core/dist/classes/types.d.ts:16

Filters classes by a string or RegExp matching their name.

***

### withDecorator?

> `optional` **withDecorator?**: `string`

Defined in: core/dist/classes/types.d.ts:18

Filters classes to only include those that have the specified decorator applied.

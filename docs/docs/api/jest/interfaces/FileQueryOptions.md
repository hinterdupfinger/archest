[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / FileQueryOptions

# Interface: FileQueryOptions

Defined in: core/dist/files/types.d.ts:14

Options to filter files when querying the AST via `getFiles()`.

## Properties

### hasClass?

> `optional` **hasClass?**: [`ClassQueryOptions`](ClassQueryOptions.md)

Defined in: core/dist/files/types.d.ts:22

Filters files to only include those containing a class matching the criteria.

***

### hasFunction?

> `optional` **hasFunction?**: [`FunctionQueryOptions`](FunctionQueryOptions.md)

Defined in: core/dist/files/types.d.ts:20

Filters files to only include those containing a function matching the criteria.

***

### inFolder?

> `optional` **inFolder?**: `string`

Defined in: core/dist/files/types.d.ts:16

Filters files to only include those residing in a specific folder path.

***

### matchNamePattern?

> `optional` **matchNamePattern?**: `string` \| `RegExp`

Defined in: core/dist/files/types.d.ts:18

Filters files by a string or RegExp matching their file name (excluding extension).

[**@archest/vitest**](../README.md)

***

[@archest/vitest](../README.md) / FileQueryOptions

# Interface: FileQueryOptions

Defined in: core/dist/files/types.d.ts:12

Options to filter files when querying the AST via `getFiles()`.

## Properties

### inFolder?

> `optional` **inFolder?**: `string`

Defined in: core/dist/files/types.d.ts:14

Filters files to only include those residing in a specific folder path.

***

### matchNamePattern?

> `optional` **matchNamePattern?**: `string` \| `RegExp`

Defined in: core/dist/files/types.d.ts:16

Filters files by a string or RegExp matching their file name (excluding extension).

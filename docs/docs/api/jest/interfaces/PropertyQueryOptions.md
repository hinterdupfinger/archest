[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / PropertyQueryOptions

# Interface: PropertyQueryOptions

Defined in: core/dist/properties/types.d.ts:12

Options to filter class properties or interface members when querying the AST via `getProperties()`.

## Properties

### inFolder?

> `optional` **inFolder?**: `string`

Defined in: core/dist/properties/types.d.ts:14

Filters properties to only include those residing in a specific folder path.

***

### matchNamePattern?

> `optional` **matchNamePattern?**: `string` \| `RegExp`

Defined in: core/dist/properties/types.d.ts:16

Filters properties by a string or RegExp matching their name.

[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / ClassData

# Interface: ClassData

Defined in: core/dist/dto.d.ts:37

Represents a class declaration extracted from a TypeScript or JavaScript file.
Includes architectural metadata such as its hierarchy and complexity.

## Properties

### cyclomatic\_complexity?

> `optional` **cyclomatic\_complexity?**: `number`

Defined in: core/dist/dto.d.ts:53

The computed McCabe cyclomatic complexity of the class methods.

***

### decorators

> **decorators**: `string`[]

Defined in: core/dist/dto.d.ts:51

An array of decorator names applied to the class.

***

### extends

> **extends**: `string` \| `null`

Defined in: core/dist/dto.d.ts:47

The name of the parent class it extends, if any.

***

### implements

> **implements**: `string`[]

Defined in: core/dist/dto.d.ts:49

An array of interface names this class implements.

***

### is\_abstract

> **is\_abstract**: `boolean`

Defined in: core/dist/dto.d.ts:45

True if the class is marked as abstract.

***

### is\_default

> **is\_default**: `boolean`

Defined in: core/dist/dto.d.ts:43

True if the class has an 'export default' modifier.

***

### is\_exported

> **is\_exported**: `boolean`

Defined in: core/dist/dto.d.ts:41

True if the class has an 'export' modifier.

***

### maintainability\_index?

> `optional` **maintainability\_index?**: `number`

Defined in: core/dist/dto.d.ts:55

The computed Halstead maintainability index (0-100).

***

### name

> **name**: `string` \| `null`

Defined in: core/dist/dto.d.ts:39

The name of the class, or null if it is an anonymous class.

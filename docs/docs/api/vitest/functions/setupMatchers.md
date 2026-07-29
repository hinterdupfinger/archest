[**@archest/vitest**](../README.md)

***

[@archest/vitest](../README.md) / setupMatchers

# Function: setupMatchers()

> **setupMatchers**(): `void`

Defined in: [vitest/src/matchers/index.ts:47](https://github.com/hinterdupfinger/archest/blob/5523fe6cbd350e0c0709c1452eecb72895034fa6/packages/vitest/src/matchers/index.ts#L47)

Registers all Archest custom matchers (e.g., `toResideInFolder`, `toHaveModifier`)
with the global Vitest `expect` instance.

This function must be called exactly once before any architectural tests are run.
The standard way to do this is to add it to a Vitest setup file.

## Returns

`void`

## Example

```typescript
// test/setup.ts
import { setupMatchers } from '@archest/vitest';
setupMatchers();
```

[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / setupMatchers

# Function: setupMatchers()

> **setupMatchers**(): `void`

Defined in: [jest/src/matchers/index.ts:47](https://github.com/hinterdupfinger/archest/blob/7e380aa35437fb3e806e053a14417ec60bf7c03a/packages/jest/src/matchers/index.ts#L47)

Registers all Archest custom matchers (e.g., `toResideInFolder`, `toHaveModifier`)
with the global Vitest `expect` instance.

This function must be called exactly once before any architectural tests are run.
The standard way to do this is to add it to a Vitest setup file.

## Returns

`void`

## Example

```typescript
// test/setup.ts
import { setupMatchers } from '@archest/jest';
setupMatchers();
```

---
sidebar_position: 6
---

# Architecture Slices

Slices allow you to automatically bucket your code into independent domains using a glob pattern, and then assert cross-talk rules between those domains. This is heavily inspired by ArchUnit's Slices and is the ultimate tool for enforcing **Feature-Sliced Design (FSD)** or **Domain-Driven Design (DDD)**.

## Getting Slices
Use `project.getSlices(pattern)` with an asterisk `*` indicating the domain name capture group.

For example, if you have a folder structure like:
- `src/features/auth/`
- `src/features/user/`
- `src/features/billing/`

You can capture `auth`, `user`, and `billing` as independent slices using the pattern `'src/features/*'`.

## Cycle Detection Between Slices

Unlike `FileLocator.toBeFreeOfCycles()` which checks for cycles between individual files (e.g. `fileA.ts -> fileB.ts -> fileA.ts`), the Slice locator checks for cycles between the **macro domains themselves**.

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();
const features = project.getSlices('src/features/*');

// This will verify that `src/features/auth` does not have a circular dependency 
// with `src/features/user`, enforcing a clean Feature-Sliced Design.
// Even if `auth/A.ts` imports `user/B.ts` and `user/C.ts` imports `auth/D.ts`, 
// Archest will flag this as a Slice Cycle.
expect(features).toBeFreeOfCycles();
```

## Structural Metrics

You can also measure the architectural stability of your slices. The **Distance from the Main Sequence** calculates the balance between a slice's Abstractness (number of abstract classes/interfaces vs concrete implementations) and Instability (afferent vs efferent couplings).

```typescript
// Slices should ideally maintain a balance < 0.8
expect(features).toHaveMaxDistanceFromMainSequence(0.8);
```

## Available Matchers

- `.toBeFreeOfCycles()`
- `.toHaveMaxDistanceFromMainSequence(max: number)`

:::tip[Slice vs File Cycle Detection]
It is highly recommended to use Slice cycle detection (`project.getSlices('.../*').toBeFreeOfCycles()`) for large monorepos instead of File cycle detection. Slice cycle detection is significantly faster because it evaluates the dependency graph at the folder boundary level rather than the individual file level.
:::

:::danger[Anti-Pattern: Shared/Common Slices]
If you have a `src/features/shared/` slice that is imported by all other slices, it is very easy to accidentally import a specific feature *into* `shared`, immediately causing a massive cyclic dependency graph. Use Slices to ensure your `shared` or `core` domains remain strictly isolated from feature implementations!
:::

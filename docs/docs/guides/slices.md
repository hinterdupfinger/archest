---
sidebar_position: 6
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Architecture Slices

Slices allow you to automatically bucket your code into independent domains using a glob pattern, and then assert cross-talk rules between those domains. This is heavily inspired by ArchUnit's Slices and is the ultimate tool for enforcing **Feature-Sliced Design (FSD)** or **Domain-Driven Design (DDD)**.

## Getting Slices
Use `project.getSlices(pattern)` with an asterisk `*` indicating the domain name capture group.

For example, if you have a folder structure like:
- `src/features/auth/`
- `src/features/user/`
- `src/features/billing/`

You can capture `auth`, `user`, and `billing` as independent slices using the pattern `'src/features/*'`.

## Cycle Detection & Slices

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

In JS/TS, you can use the Slice locator to detect circular dependencies between entire folders (e.g. `src/features/auth` and `src/features/user`):

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();
const features = project.getSlices('src/features/*');

// This will verify that `src/features/auth` does not have a circular dependency 
// with `src/features/user`, enforcing a clean Feature-Sliced Design.
expect(features).toBeFreeOfCycles();
```

You can also measure the architectural stability of your slices. The **Distance from the Main Sequence** calculates the balance between a slice's Abstractness and Instability:

```typescript
// Slices should ideally maintain a balance < 0.8
expect(features).toHaveMaxDistanceFromMainSequence(0.8);
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

In Java, define slices using `getSlices(pattern)` and verify them using `ArchestAssertions`:

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;

SliceLocator features = project.getSlices("src/features/*");

// Verify slices are free of cycle chains
ArchestAssertions.assertThat(features).toBeFreeOfCycles();

// Verify architectural stability
ArchestAssertions.assertThat(features).toHaveMaxDistanceFromMainSequence(0.8);
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

In Kotest, define slices and assert on them using extension and infix matchers:

```kotlin
import org.archest.core.*
import org.archest.kotest.*

val features = project.getSlices("src/features/*")

// Verify slices are free of cycle chains
features.shouldBeFreeOfCycles()

// Verify architectural stability
features shouldHaveMaxDistanceFromMainSequence 0.8
```

</TabItem>
</Tabs>

## Available Matchers

- **TypeScript / JS**:
  - `.toBeFreeOfCycles()` (for slices and files)
  - `.toHaveMaxDistanceFromMainSequence(max: number)` (for slices)
- **JVM (JUnit 6 / Kotest)**:
  - `.toBeFreeOfCycles()` / `shouldBeFreeOfCycles()` (for slices and files)
  - `.toHaveMaxDistanceFromMainSequence(double)` / `shouldHaveMaxDistanceFromMainSequence` (for slices)

:::tip[Slice vs File Cycle Detection]
It is highly recommended to use Slice cycle detection (`project.getSlices('.../*').toBeFreeOfCycles()`) for large monorepos instead of File cycle detection. Slice cycle detection is significantly faster because it evaluates the dependency graph at the folder boundary level rather than the individual file level.
:::

:::danger[Anti-Pattern: Shared/Common Slices]
If you have a `src/features/shared/` slice that is imported by all other slices, it is very easy to accidentally import a specific feature *into* `shared`, immediately causing a massive cyclic dependency graph. Use Slices to ensure your `shared` or `core` domains remain strictly isolated from feature implementations!
:::

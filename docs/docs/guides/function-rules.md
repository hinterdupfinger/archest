---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Function Rules

Function rules allow you to inspect the AST of functions across your project. This is especially useful for enforcing functional programming conventions, ensuring async consistency, or maintaining predictable module exports.

## Finding Functions
Start by calling `project.getFunctions(options)`.

You can filter functions using the `FunctionQueryOptions` object:
- **`inFolder`**: Restricts the query to functions physically located in `folder`.
- **`matchNamePattern`**: Restricts the query to functions whose name matches the given pattern (string or RegExp).

- **`isTopLevel`**: A boolean that restricts the query to top-level standalone functions, ignoring class methods entirely.

## Assertions

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

In TypeScript/JS, you can use built-in function matchers:

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

// Example 1: Enforce React Hook conventions
// All functions starting with 'use' must be exported
const hooks = project.getFunctions({ matchNamePattern: /^use/ });
expect(hooks).toHaveModifier('export');

// Example 2: API boundary enforcement
// Ensure all top-level functions in the services folder are exported
const fns = project.getFunctions({ inFolder: 'services', isTopLevel: true });
expect(fns).toHaveModifier('export');

// Example 3: Type Safety
// Ensure they all have explicit return types
expect(fns).toHaveExplicitReturnType();

// Example 4: Async conventions
// All functions in a 'database' folder must be async
const dbFns = project.getFunctions({ inFolder: 'database' });
expect(dbFns).toHaveModifier('async');
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

In Java, query functions using `getFunctions()` and assert on them using `ArchestAssertions`:

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;

// All top-level functions in services must be public/exported
FunctionLocator fns = project.getFunctions(
    new FunctionQueryOptions().inFolder("services").isTopLevel(true)
);
ArchestAssertions.assertThat(fns)
    .toHaveModifier("export")
    .toHaveExplicitReturnType();

// All functions in a 'database' folder must be async/suspend
FunctionLocator dbFns = project.getFunctions(
    new FunctionQueryOptions().inFolder("database")
);
ArchestAssertions.assertThat(dbFns).toHaveModifier("async");
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

In Kotlin/Kotest, assert on functions using extension and infix matchers:

```kotlin
import org.archest.core.*
import org.archest.kotest.*

// All top-level functions in services must be public/exported
val fns = project.getFunctions(
    FunctionQueryOptions().inFolder("services").isTopLevel(true)
)
fns shouldHaveModifier "export"
fns.shouldHaveExplicitReturnType()

// All functions in a 'database' folder must be async/suspend
val dbFns = project.getFunctions(FunctionQueryOptions().inFolder("database"))
dbFns shouldHaveModifier "async"
```

</TabItem>
</Tabs>

- **TypeScript / JS**:
  - `.toHaveModifier(modifier: 'export' | 'async' | 'private' | 'public')`
  - `.toHaveExplicitReturnType()`
  - `.toMatchNamePattern(pattern: string | RegExp)`
  - `.toHaveNameMatchingFileName()`
  - `.toHaveMaxCyclomaticComplexity(max: number)`
  - `.toHaveMinMaintainabilityIndex(min: number)`
- **JVM (JUnit 6 / Kotest)**:
  - `.toHaveModifier(String)` / `shouldHaveModifier` (supports `export`, `async`)
  - `.toHaveExplicitReturnType()` / `shouldHaveExplicitReturnType()`
  - `.toMatchNamePattern(String)` / `shouldMatchNamePattern`
  - `.toHaveNameMatchingFileName()` / `shouldHaveNameMatchingFileName()`
  - `.toHaveMaxCyclomaticComplexity(long)` / `shouldHaveMaxCyclomaticComplexity`
  - `.toHaveMinMaintainabilityIndex(long)` / `shouldHaveMinMaintainabilityIndex`

:::warning[Gotcha: Anonymous Arrow Functions]
Archest attempts to infer the names of assigned arrow functions (e.g., `const myFunc = () => {}`). However, deeply nested anonymous callbacks passed into other functions will not be assigned names and will be identified as "Anonymous Function" in error messages.
:::

:::danger[Anti-Pattern: Overly Strict Return Types]
Using `toHaveExplicitReturnType()` on UI components (like React components returning `JSX.Element`) is often redundant if you rely on TypeScript's type inference. Use this matcher primarily for core domain logic or public SDK boundaries where explicit types are critical for backwards compatibility.
:::

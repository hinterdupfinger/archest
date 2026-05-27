---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Property Rules

Property rules allow you to inspect the characteristics of class properties across your project. This is highly useful for guaranteeing immutability across data transfer objects (DTOs) or state management models.

## Finding Properties
Start by calling `project.getProperties(options)`.

You can filter properties using the `PropertyQueryOptions` object:
- **`inFolder`**: Restricts the query to properties physically located in `folder`.
- **`matchNamePattern`**: Restricts the query to properties whose name matches the given pattern (string or RegExp).

## Assertions

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

In TypeScript/JS, you can use built-in property matchers:

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

// Example 1: Strict Immutability for specific properties
// Ensure all properties named 'id' across the entire codebase are marked as readonly
const idProps = project.getProperties({ matchNamePattern: /^id$/ });
expect(idProps).toBeReadonly();

// Example 2: Immutability for entire layers
// Ensure all properties in the Data Transfer Objects (dto) folder are readonly
const dtoProps = project.getProperties({ inFolder: 'dto' });
expect(dtoProps).toBeReadonly();

// Example 3: Negation
// Ensure mutable state properties are NOT readonly
const stateProps = project.getProperties({ inFolder: 'state' });
expect(stateProps).not.toBeReadonly();
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

In Java, query properties using `getProperties()` and assert on them using `ArchestAssertions`:

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;

// Ensure all properties named 'id' across the entire codebase are marked as final/readonly
PropertyLocator idProps = project.getProperties(new PropertyQueryOptions().matchNamePattern("^id$"));
ArchestAssertions.assertThat(idProps).toBeReadonly();

// Ensure all properties in the DTO layer are final/readonly
PropertyLocator dtoProps = project.getProperties(new PropertyQueryOptions().inFolder("dto"));
ArchestAssertions.assertThat(dtoProps).toBeReadonly();
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

In Kotlin/Kotest, assert on properties using extension and infix matchers:

```kotlin
import org.archest.core.*
import org.archest.kotest.*

// Ensure all properties named 'id' are read-only (val)
val idProps = project.getProperties(PropertyQueryOptions().matchNamePattern("^id$"))
idProps.shouldBeReadonly()

// Ensure all properties in files under 'dto' directory are read-only
val dtoProps = project.getProperties(PropertyQueryOptions().inFolder("dto"))
dtoProps.shouldBeReadonly()
```

</TabItem>
</Tabs>

## Available Matchers

- **TypeScript / JS**:
  - `.toBeReadonly()`
- **JVM (JUnit 6 / Kotest)**:
  - `.toBeReadonly()` / `shouldBeReadonly()`

:::warning[Gotcha: Interface Properties vs Class Properties]
`getProperties` only inspects actual `ClassDeclaration` properties. It does not parse `InterfaceDeclaration` properties. If you need to ensure an interface property is readonly, use standard TypeScript compiler checks.
:::

:::tip[State Management]
If you are using libraries like Redux or Vuex where state mutations are handled via specific reducers/mutations, enforcing `.toBeReadonly()` on your core model properties guarantees that junior developers don't accidentally mutate state directly.
:::

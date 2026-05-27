---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Layered Architecture

Inspired directly by ArchUnit, the Layered Architecture builder allows you to explicitly map folder patterns to named architectural layers, and then assert cross-talk boundaries. This is highly effective for strictly enforcing N-Tier architectures (e.g., UI -> Services -> Data Access).

## Defining Layers & Boundaries

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

In JS/TS, use the fluent `layeredArchitecture()` builder:

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

const architecture = project.layeredArchitecture()
  .layer('Controllers', 'controllers')
  .layer('Services', 'services')
  .layer('Repositories', 'repositories');

// Controllers represent the entrypoint; they cannot be imported by any other layer
const rule1 = architecture
  .whereLayer('Controllers').shouldNotBeAccessedByAnyLayer()
  .check();

expect(rule1).toPass();

// Repositories manage data access and should ONLY be accessed by the business logic (Services) layer
const rule2 = architecture
  .whereLayer('Repositories').shouldOnlyBeAccessedBy('Services')
  .check();

expect(rule2).toPass();
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

In Java, use the fluent `layeredArchitecture()` builder and assert it using `ArchestAssertions`:

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;

LayeredArchitecture architecture = project.layeredArchitecture()
  .layer("Controllers", "controllers")
  .layer("Services", "services")
  .layer("Repositories", "repositories");

// Controllers cannot be accessed by other layers
architecture.whereLayer("Controllers").shouldNotBeAccessedByAnyLayer();

// Repositories should only be accessed by Services
architecture.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services");

ArchestAssertions.assertThat(architecture).toPass();
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

In Kotlin/Kotest, declare layer boundaries and assert them using the `shouldPass()` matcher DSL:

```kotlin
import org.archest.core.*
import org.archest.kotest.*

val architecture = project.layeredArchitecture()
  .layer("Controllers", "controllers")
  .layer("Services", "services")
  .layer("Repositories", "repositories")

architecture.whereLayer("Controllers").shouldNotBeAccessedByAnyLayer()
architecture.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services")

architecture.shouldPass()
```

</TabItem>
</Tabs>

## Available Matchers

- **TypeScript / JS**:
  - `.toPass()`: Evaluates the rules configured on the Layered Architecture builder.
- **JUnit 6 (Java)**:
  - `ArchestAssertions.assertThat(layered).toPass()`
- **Kotest (Kotlin)**:
  - `layered.shouldPass()`

:::warning[Gotcha: Layer Access Includes Sub-directories]
When you define a layer with `.layer('Services', 'services')`, any file inside `services/` or `services/sub-folder/` is considered part of the Services layer. 
:::

:::danger[Anti-Pattern: Skipping Layers]
The Layered Architecture builder does not implicitly prevent "skipping" layers (e.g., Controllers talking directly to Repositories). If you define a `.shouldOnlyBeAccessedBy('Services')` rule on Repositories, it inherently blocks Controllers from accessing Repositories. But if you forget to add that rule, Controllers *will* be able to access Repositories. Always define access rules for your deepest layers!
:::

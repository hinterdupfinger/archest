---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# File Rules & Dependency Checks

File-level rules allow you to query your project files and assert rules about their imports, dependencies, and circular dependency cycles. This is the foundation of preventing "spaghetti code" and circular imports.

---

## 1. Finding & Filtering Files

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="TypeScript / JS">

Start by calling `project.getFiles(options)`. You can filter files using the `FileQueryOptions` object:
*   **`inFolder`**: Finds files whose absolute path includes the exact folder (e.g. `'services'`).
*   **`matchNamePattern`**: Restricts the query to files whose name matches the given pattern (string or RegExp).

```typescript
const serviceFiles = project.getFiles({ inFolder: 'services' });
const indexFiles = project.getFiles({ matchNamePattern: /.*\/index\.ts$/ });
```

</TabItem>
<TabItem value="jvm" label="JVM (Java / Kotlin)">

Query files from `ArchestProject` using `getFiles()` and optional `FileQueryOptions`:

```kotlin
// In Kotlin / Java
val serviceFiles = project.getFiles(FileQueryOptions().inFolder("services"))
val indexFiles = project.getFiles(FileQueryOptions().matchNamePattern(".*Index\\.kt"))
```

</TabItem>
</Tabs>

---

## 2. Dependency & Path Checks

You can assert that a set of files do or do not depend on other folders or external modules.

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="TypeScript / JS">

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();
const uiComponents = project.getFiles({ inFolder: 'components' });

// Ensure UI components NEVER import directly from the database layer
expect(uiComponents).not.toDependOnFilesInFolder('database');

// Ensure controllers depend on services
const controllers = project.getFiles({ inFolder: 'controllers' });
expect(controllers).toDependOnFilesInFolder('services');

// Ensure files outside src/graphql/ do not import 'gql-tada'
const nonGraphqlFiles = project.getFiles({ matchNamePattern: /^(?!.*\/graphql\/).*/ });
expect(nonGraphqlFiles).not.toDependOnExternalModule('gql-tada');
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;

FileLocator uiComponents = project.getFiles(new FileQueryOptions().inFolder("components"));

// Ensure UI components NEVER import directly from the database layer
ArchestAssertions.assertThat(uiComponents).notToDependOnFilesInFolder("database");

// Ensure controllers depend on services
FileLocator controllers = project.getFiles(new FileQueryOptions().inFolder("controllers"));
ArchestAssertions.assertThat(controllers).toDependOnFilesInFolder("services");

// Ensure files outside graphql/ do not import external dependencies
FileLocator nonGraphqlFiles = project.getFiles(new FileQueryOptions().matchNamePattern("^(?!.*/graphql/).*"));
ArchestAssertions.assertThat(nonGraphqlFiles).notToDependOnExternalModule("org.graphql");
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

```kotlin
import org.archest.core.*
import org.archest.kotest.*

val uiComponents = project.getFiles(FileQueryOptions().inFolder("components"))
uiComponents shouldNotDependOnFilesInFolder "database"

val controllers = project.getFiles(FileQueryOptions().inFolder("controllers"))
controllers shouldDependOnFilesInFolder "services"
```

</TabItem>
</Tabs>

---

## 3. Cycle Detection (Multi-Platform)

Circular dependencies cause massive runtime coupling and memory leaks. Archest traverses the import graph of your files to ensure they are completely free of cyclic dependencies.

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

```typescript
const coreFiles = project.getFiles({ inFolder: 'core' });

// Traverses the entire AST import graph of the 'core' folder to detect cycles
expect(coreFiles).toBeFreeOfCycles();
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

```java
@ArchTest
public static final ArchestRule packageShouldBeFreeOfCycles =
    ArchestRules.files()
        .matching(".*")
        .shouldBeFreeOfCycles();
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

```kotlin
// Check circular dependencies on all files under the project
project.files(".*").shouldBeFreeOfCycles()
```

</TabItem>
</Tabs>

---

## 4. Structural Metrics & Limits

You can enforce limits on complexity, maintainability, and export structure of files:

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="TypeScript / JS">

```typescript
const coreFiles = project.getFiles({ inFolder: 'core' });

// Ensure files are maintainable
expect(coreFiles).toHaveMaxCyclomaticComplexity(100);
expect(coreFiles).toHaveMinMaintainabilityIndex(20);

// Enforce single-responsibility principle by limiting exports
expect(coreFiles).toHaveMaxExportedFunctions(1);
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

```java
FileLocator coreFiles = project.getFiles(new FileQueryOptions().inFolder("core"));

ArchestAssertions.assertThat(coreFiles)
    .toHaveMaxCyclomaticComplexity(100)
    .toHaveMinMaintainabilityIndex(20)
    .toHaveMaxExportedFunctions(1);
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

```kotlin
val coreFiles = project.getFiles(FileQueryOptions().inFolder("core"))

coreFiles shouldHaveMaxCyclomaticComplexity 100
coreFiles shouldHaveMinMaintainabilityIndex 20
coreFiles shouldHaveMaxExportedFunctions 1
```

</TabItem>
</Tabs>

---

## Available Matchers

*   **TypeScript / JS**:
    *   `.toDependOnFilesInFolder(folder: string)`
    *   `.toDependOnExternalModule(moduleName: string | RegExp)`
    *   `.toBeFreeOfCycles()`
    *   `.toMatchNamePattern(pattern: string | RegExp)`
    *   `.toHaveMaxExportedFunctions(max: number)`
    *   `.toHaveMaxCyclomaticComplexity(max: number)`
    *   `.toHaveMinMaintainabilityIndex(min: number)`
*   **JVM (JUnit 6 / Kotest)**:
    *   `.toDependOnFilesInFolder(String)` / `shouldDependOnFilesInFolder`
    *   `.toDependOnExternalModule(String)` / `shouldDependOnExternalModule`
    *   `.toBeFreeOfCycles()` / `shouldBeFreeOfCycles()`
    *   `.toMatchNamePattern(String)` / `shouldMatchNamePattern`
    *   `.toHaveMaxExportedFunctions(long)` / `shouldHaveMaxExportedFunctions`
    *   `.toHaveMaxCyclomaticComplexity(long)` / `shouldHaveMaxCyclomaticComplexity`
    *   `.toHaveMinMaintainabilityIndex(long)` / `shouldHaveMinMaintainabilityIndex`

:::warning[Gotcha: External Libraries]
In JavaScript/TypeScript, `toDependOnFilesInFolder` ignores external library imports (`node_modules`). It is strictly used for checking internal project directory dependencies. To assert dependencies on external packages, use `toDependOnExternalModule`.
:::

:::danger[Anti-Pattern: Massive Cycle Checks]
Running `.toBeFreeOfCycles()` on the *entire* codebase can be slow on large monorepos because it calculates a global directed graph. Prefer running cycle checks on specific domain bounds (e.g. `project.getFiles({ inFolder: 'domainA' }).toBeFreeOfCycles()`).
:::

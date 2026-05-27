---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Class Rules & Dependency Checks

Class-level rules allow you to query classes in your codebase and assert rules about their dependencies, formatting, decorators, and structural requirements.

---

## 1. Class-Level Dependency Assertions (Multi-Platform)

You can assert that a group of classes matching one pattern does not import or depend on another group of classes matching a different pattern. This enforces strict architectural boundaries (e.g. ensuring repositories never import controllers).

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="Vitest / Jest">

In TypeScript/JS, you achieve class dependency assertions by querying files or checking the classes:

```typescript
const repositories = project.getClasses({ matchNamePattern: /Repository$/ });
// Check class dependency rules
expect(repositories).not.toDependOnFilesInFolder('controllers');
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

```java
@ArchTest
public static final ArchestRule repositoryShouldNotDependOnController =
    ArchestRules.classes()
        .matching(".*Repository")
        .shouldNotDependOn(".*Controller");
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

```kotlin
// Ensure repository classes never depend on controller classes
project.classes(".*Repository") shouldNotDependOn ".*Controller"
```

</TabItem>
</Tabs>

---

## 2. Advanced AST Inspections

You can perform deep inspections of the class AST, including inheritance, interface implementation, modifiers, and decorators, across both JavaScript/TypeScript and JVM projects.

### Query Filtering Options
When calling `project.getClasses(options)`, you can filter using `ClassQueryOptions`:
*   **`inFolder`**: Filters to classes physically located in the specified folder (e.g., `'services'`).
*   **`matchNamePattern`**: Filters to classes matching a name pattern.
*   **`withDecorator`**: Filters to classes annotated with a specific decorator (e.g., `'Injectable'`).
*   **`extending`**: Filters to classes extending a specific base class (e.g., `'BaseRepository'`).
*   **`implementing`**: Filters to classes implementing a specific interface (e.g., `'Initializable'`).
*   **`havingModifier`**: Filters to classes with specific modifiers (e.g., `'export'`, `'abstract'`, `'default'`).

---

## 3. Structural Examples

<Tabs defaultValue="ts" groupId="language-tabs">
<TabItem value="ts" label="TypeScript / JS">

### Example: Enforcing Framework Conventions
```typescript
// 1. All classes ending with 'Controller' MUST reside in a 'controllers' folder.
const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
expect(controllers).toResideInFolder('controllers');

// 2. All classes in the 'controllers' folder MUST be exported and match name conventions
const folderClasses = project.getClasses({ inFolder: 'controllers' });
expect(folderClasses).toHaveModifier('export');
```

### Example: Enforcing Object-Oriented Interfaces
```typescript
const repositories = project.getClasses({ matchNamePattern: /Repository$/ });

// Ensure all repositories implement the BaseRepository interface
expect(repositories).toImplementInterface('BaseRepository');

// Ensure all Data Access Objects extend a BaseEntity
const daos = project.getClasses({ inFolder: 'dao' });
expect(daos).toExtendClass('BaseEntity');
```

</TabItem>
<TabItem value="junit6" label="JUnit 6 (Java)">

### Example: Enforcing Framework Conventions
```java
// 1. All classes ending with 'Controller' MUST reside in a 'controllers' folder.
ClassLocator controllers = project.getClasses(new ClassQueryOptions().matchNamePattern(".*Controller$"));
ArchestAssertions.assertThat(controllers).toResideInFolder("controllers");

// 2. All classes in the 'controllers' folder MUST be exported/public
ClassLocator folderClasses = project.getClasses(new ClassQueryOptions().inFolder("controllers"));
ArchestAssertions.assertThat(folderClasses).toHaveModifier("export");
```

### Example: Enforcing Object-Oriented Interfaces
```java
ClassLocator repositories = project.getClasses(new ClassQueryOptions().matchNamePattern(".*Repository$"));

// Ensure all repositories implement the BaseRepository interface
ArchestAssertions.assertThat(repositories).toImplementInterface("BaseRepository");

// Ensure all Data Access Objects extend a BaseEntity
ClassLocator daos = project.getClasses(new ClassQueryOptions().inFolder("dao"));
ArchestAssertions.assertThat(daos).toExtendClass("BaseEntity");
```

</TabItem>
<TabItem value="kotest" label="Kotest (Kotlin DSL)">

### Example: Enforcing Framework Conventions
```kotlin
// 1. All classes ending with 'Controller' MUST reside in a 'controllers' folder.
val controllers = project.getClasses(ClassQueryOptions().matchNamePattern(".*Controller$"))
controllers shouldResideInFolder "controllers"

// 2. All classes in the 'controllers' folder MUST be exported/public
val folderClasses = project.getClasses(ClassQueryOptions().inFolder("controllers"))
folderClasses shouldHaveModifier "export"
```

### Example: Enforcing Object-Oriented Interfaces
```kotlin
val repositories = project.getClasses(ClassQueryOptions().matchNamePattern(".*Repository$"))

// Ensure all repositories implement the BaseRepository interface
repositories shouldImplementInterface "BaseRepository"

// Ensure all Data Access Objects extend a BaseEntity
val daos = project.getClasses(ClassQueryOptions().inFolder("dao"))
daos shouldExtendClass "BaseEntity"
```

</TabItem>
</Tabs>

---

## Available Matchers

*   **TypeScript / JS**:
    *   `.toResideInFolder(folder: string)`
    *   `.toMatchNamePattern(pattern: string | RegExp)`
    *   `.toHaveModifier(modifier: 'export' | 'default' | 'abstract')`
    *   `.toExtendClass(className: string)`
    *   `.toImplementInterface(interfaceName: string)`
    *   `.toHaveNameMatchingFileName()`
    *   `.toHaveMaxCyclomaticComplexity(max: number)`
*   **JVM (JUnit 6 / Kotest)**:
    *   `shouldNotDependOn(targetPattern: string)` / `.shouldNotDependOn(targetPattern)` (legacy DSL)
    *   `.toResideInFolder(String)` / `shouldResideInFolder`
    *   `.toHaveModifier(String)` / `shouldHaveModifier` (supports `export`, `default`, `abstract`)
    *   `.toExtendClass(String)` / `shouldExtendClass`
    *   `.toImplementInterface(String)` / `shouldImplementInterface`
    *   `.toMatchNamePattern(String)` / `shouldMatchNamePattern`
    *   `.toHaveMaxCyclomaticComplexity(long)` / `shouldHaveMaxCyclomaticComplexity`
    *   `.toHaveNameMatchingFileName()` / `shouldHaveNameMatchingFileName()`

:::warning[Gotcha: Anonymous Classes]
In JS/TS, default exported classes without a name (`export default class {}`) are parsed as anonymous classes. Pattern matchers (`toMatchNamePattern`) will fail on anonymous classes unless you explicitly name them.
:::

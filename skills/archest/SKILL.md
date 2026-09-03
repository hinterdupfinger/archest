---
name: archest
description: >
  Use this skill when the user wants to write, modify, or verify architecture tests, fitness functions, or structural rules. Apply this when the user needs to enforce folder boundaries, layer separation, naming conventions, or dependency restrictions in TypeScript projects (Vitest/Jest) or JVM projects (JUnit 6/Kotest), even if they don't explicitly mention "@archest/vitest".
---

# Archest Architectural Testing Framework

Archest is a multi-platform architectural testing framework that relies on a high-performance native Rust core backend to enforce constraints on folder boundaries, package dependencies, naming conventions, class/interface structures, and cyclic imports.

Before writing or modifying rules:
*   Review the [general concepts of architecture testing & fitness functions](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/architecture-testing.md).
*   Follow the [project analysis & user clarification guidelines](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/project-analysis-guidelines.md) to audit the codebase structure and interview the user before implementing rules.

---

## 1. Supported Testing Frameworks & Setup Guides

To keep setup guidelines small and clean, please refer to the specific configuration guide for your target framework:

*   **Vitest (TypeScript / JS)**: Review the [Vitest setup guide](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/vitest.md)
*   **Jest (TypeScript / JS)**: Review the [Jest setup guide](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/jest.md)
*   **JUnit 6 (Java / Kotlin)**: Review the [JUnit 6 setup guide](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/junit.md)
*   **Kotest (Kotlin DSL)**: Review the [Kotest setup guide](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/kotest.md)

---

## 2. Installation Templates & Repository Configuration

For JVM projects, artifacts must be resolved via the GitHub Packages Maven repository (`https://maven.pkg.github.com/hinterdupfinger/archest`). We provide ready-to-use repository credentials and dependency configurations in:
*   **Gradle (Kotlin DSL)**: [gradle-config.gradle.kts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/gradle-config.gradle.kts)
*   **Maven**: [maven-config.xml](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/maven-config.xml)

---

## 3. Template Code Examples

Complete template test spec configurations are available in the `examples/` directory:

*   **Vitest Spec**: [VitestArchitectureTest.ts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/VitestArchitectureTest.ts)
*   **Jest Spec**: [JestArchitectureTest.ts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/JestArchitectureTest.ts)
*   **JUnit 6 Class**: [Junit6ArchitectureTest.java](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/Junit6ArchitectureTest.java)
*   **Kotest Spec**: [KotestArchitectureSpec.kt](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/KotestArchitectureSpec.kt)

---

## 4. Query & Matcher Core Concepts

The returned project instance provides locators to isolate AST structures for rules matching:
*   **Files**: Find files by folder path or matching file patterns.
*   **Classes**: Match classes by folders, names, decorators, interface implementations, base classes, or modifiers.
*   **Functions**: Query standalone top-level functions or methods, testing return types, modifiers, and complexity.
*   **Properties**: Track field-level details like read-only traits (e.g. `readonly` or `final`).
*   **Slices & Layers**: Define macro-architectural slices using wildcards, detecting structural cycles or checking distance to the main sequence.

---

## 5. Counter-Checks & Vacuous Truth Prevention (MANDATORY)

A common and critical failure mode in architectural testing is the **vacuous test**:
*   If a locator query has a typo (`inFolder: 'dmain'`), an empty folder, or a moved directory, the locator matches **zero** elements.
*   In Vitest and Jest, negative assertions (e.g. `.not.toDependOnFilesInFolder(...)`) invert a failed non-empty check (`!false` -> `true`), causing the test to **pass silently with 0 files tested**.
*   If the target boundary directory does not exist or has been renamed, the test also passes vacuously.

### The Mandatory Counter-Check Rule:
**Always assert non-emptiness on the selected elements and target boundaries before testing rules:**
```typescript
// Vitest / Jest: Source & Target non-emptiness counter-checks
const domain = project.getFiles({ inFolder: 'domain' });
const infra = project.getFiles({ inFolder: 'infrastructure' });

expect(domain.files.length).toBeGreaterThan(0); // Counter-check: domain has files!
expect(infra.files.length).toBeGreaterThan(0);  // Counter-check: target infra exists!
expect(domain).not.toDependOnFilesInFolder('infrastructure');
```
```java
// JUnit 6:
FileLocator domain = project.getFiles(new FileQueryOptions().inFolder("domain"));
assertFalse(domain.getFiles().isEmpty(), "Counter-check: domain must contain files");
ArchestAssertions.assertThat(domain).notToDependOnFilesInFolder("infrastructure");
```
```kotlin
// Kotest:
val domain = project.getFiles(FileQueryOptions(inFolder = "domain"))
domain.files.shouldNotBeEmpty() // Counter-check
domain shouldNotDependOnFilesInFolder "infrastructure"
```

---

## 6. High-Value Architecture Tests to Include

When auditing a codebase or implementing architectural guardrails, prioritize these **6 high-value test archetypes**:

1.  **Inward Dependency & Clean / Hexagonal Isolation**:
    *   Core `domain` must never import `infrastructure`, `database`, `ui`, or external frameworks.
2.  **Framework & Persistence Leakage Prevention**:
    *   Ensure domain/application files do not depend on external ORMs (`@prisma/client`, `typeorm`, `mongoose`, `hibernate`) or HTTP transport libraries (`express`, `fastify`, `@nestjs/common`, `spring-web`).
3.  **Cyclic Dependency & Cycle Elimination**:
    *   Enforce that feature slices and core directories are 100% free of circular dependencies (`toBeFreeOfCycles()`).
4.  **Cross-Slice / Modular Monolith Isolation**:
    *   Feature modules (`auth`, `billing`, `orders`) must not reach into private internal directories of neighboring slices.
5.  **Structural, Naming & Contract Symmetry**:
    *   Controllers must end with `Controller`, services with `Service`, repositories must implement `IRepository`, and exported classes/functions must match parent filenames (`toHaveNameMatchingFileName()`).
6.  **Architectural Fitness & Maintainability Guardrails**:
    *   Cap maximum cyclomatic complexity (`toHaveMaxCyclomaticComplexity(10)`), ensure minimum maintainability indices (`toHaveMinMaintainabilityIndex(65)`), and enforce distance from the main sequence (`toHaveMaxDistanceFromMainSequence(0.3)`).

For detailed examples and code patterns, review [architecture-testing.md](file:///Users/jonathan/projects/vitest-arch/skills/archest/resources/architecture-testing.md).


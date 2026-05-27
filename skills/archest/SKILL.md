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

For a comprehensive index of all matcher operations supported on each platform, refer to the guides above.

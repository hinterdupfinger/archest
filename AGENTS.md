# Agent Instructions (AGENTS.md)

Welcome! If you are an AI agent working on the `archest` repository, you must adhere strictly to the guidelines and workflows documented below.

This repository is a specialized architectural testing framework that relies on a high-performance native Rust backend (`@archest/core-rust`) for AST parsing and cycle detection, supporting both JavaScript/TypeScript environments (via Jest/Vitest) and JVM environments (via JUnit 6 and Kotest).

## Project Guidelines & Context Files

To keep instructions modular and token-efficient, please review the specific context file corresponding to the area you are modifying:

1. **[Mandatory Workflow & Quality Control](file:///Users/jonathan/projects/vitest-arch/context/workflow.md)**
   * Outlines the mandatory validation checks, Biome linting compliance, and development constraints.
2. **[Codebase Architecture & Testing](file:///Users/jonathan/projects/vitest-arch/context/architecture.md)**
   * Details functional patterns, file naming rules, test colocation strategies, and test exclusions.
3. **[Rust Backend & NAPI Bindings](file:///Users/jonathan/projects/vitest-arch/context/rust.md)**
   * Covers NAPI-RS Node bindings compilation, native state isolation, Svelte/Vue script extraction, and mock AST factory testing.
4. **[JVM Integration (Java & Kotlin)](file:///Users/jonathan/projects/vitest-arch/context/jvm.md)**
   * Details JDK 26/Foojay configurations, Java 17 bytecode constraints, JNA packaging, and Gradle jar task dependencies.
5. **[Version Management & Release Flow](file:///Users/jonathan/projects/vitest-arch/context/releases.md)**
   * Details monorepo version synchronization, Cargo manifests, dynamic Gradle properties, and the multi-platform CI/CD release workflow.
6. **[User Documentation & Guides](file:///Users/jonathan/projects/vitest-arch/context/docs.md)**
   * Details Docusaurus structures, multi-platform code tab conventions, API parity policies, and local documentation server verification.

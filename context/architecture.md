# Codebase Architecture & Testing

Guidelines on functional architecture patterns, project structure constraints, and testing strategies.

## Codebase Architecture & Design Principles

* **Functional & Modular**: The framework strictly adheres to a functional architecture. Avoid ES6 classes unless absolutely necessary (e.g., Error boundaries or matchers that specifically require it). Use Data Transfer Objects (DTOs) and pure functions.
* **Internal Architecture Enforcement**: The project uses its own capabilities to enforce its structure. 
  * Look at `packages/vitest-arch/test/architecture.test.ts`.
  * **File Naming Constraint**: Functions must have a name matching their filename (e.g., `ruleBuilder` must live in `ruleBuilder.ts`).
  * Shared abstractions must live in `src/core/shared/` and be prefixed with `sharedCheck`.

---

## Testing Strategy

* **Colocation**: All unit tests for the core logic must be colocated with their implementation (e.g., `locateClasses.test.ts` lives next to `locateClasses.ts` in `src/core/classes/`).
* **Test Isolation**: The `testUtils.ts` file provides helpers like `createSourceFile` and `createMockProgram` for isolated unit testing. Avoid using `parseProject` for internal core unit tests, as it is heavy and meant for end-to-end usage.
* **Test Exclusions**: The `tsconfig.json` explicitly excludes `src/**/*.test.ts`. This prevents test files from being evaluated by our internal architectural rules and keeps them out of the production npm bundle.

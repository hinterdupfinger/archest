# Agent Instructions (AGENTS.md)

Welcome! If you are an AI agent working on the `archest` (formerly `vitest-arch`) repository, you must adhere strictly to the guidelines and workflows outlined below. This project is a specialized architectural testing framework that heavily interacts with the TypeScript Compiler API.

## Mandatory Agent Workflow

Before concluding any task or reporting success to the user, you **MUST** ensure both code quality and test integrity by running the following commands:

1. **Linting & Formatting**: 
   ```bash
   pnpm check
   ```
   *This runs Biome. All files must pass linting without warnings. See the Linting Rules section below.*

2. **Building & Testing**:
   ```bash
   pnpm build && pnpm -r test
   ```
   *Because the `examples/` workspaces consume the core framework, you MUST run `pnpm build` inside `packages/vitest-arch` before running the workspace tests (`pnpm -r test`).*

---

## 1. Codebase Architecture & Design Principles

* **Functional & Modular**: The framework strictly adheres to a functional architecture. Avoid ES6 classes unless absolutely necessary (e.g., Error boundaries or matchers that specifically require it). Use Data Transfer Objects (DTOs) and pure functions.
* **Internal Architecture Enforcement**: The project uses its own capabilities to enforce its structure. 
  * Look at `packages/vitest-arch/test/architecture.test.ts`.
  * **File Naming Constraint**: Functions must have a name matching their filename (e.g., `ruleBuilder` must live in `ruleBuilder.ts`).
  * Shared abstractions must live in `src/core/shared/` and be prefixed with `sharedCheck`.

## 2. Linting Rules & Biome

* **Strict Biome Compliance**: We use `biome` for all linting and formatting. 
* **DO NOT** disable global rules in `biome.json`.
* If you must use `any` (e.g., when mocking complex `ts.Program` objects in tests) or non-null assertions (`!`), use inline suppression comments with a justification:
  ```typescript
  // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
  const program = {} as any;
  ```

## 3. TypeScript Compiler API Gotchas

Working with the TS Compiler API in this repository requires special attention to AST binding:

* **Parent Pointers**: If you create a `ts.Program`, you **MUST** call `program.getTypeChecker()` immediately after. This forces the TypeScript compiler to bind the AST, which populates the `.parent` pointers on nodes. Without this, calling `node.getSourceFile()` will silently return `undefined` and crash the locators.
* **Synthetic Nodes**: When writing unit tests and generating synthetic AST nodes, always pass `true` as the `setParentNodes` argument to `ts.createSourceFile`.
* **Vue/Svelte Support**: We extract the contents of `<script>` blocks from `.vue` and `.svelte` files and parse them using `ts.createSourceFile` as `ScriptKind.TS`.

## 4. Testing Strategy

* **Colocation**: All unit tests for the core logic must be colocated with their implementation (e.g., `locateClasses.test.ts` lives next to `locateClasses.ts` in `src/core/classes/`).
* **Test Isolation**: The `testUtils.ts` file provides helpers like `createSourceFile` and `createMockProgram` for isolated unit testing. Avoid using `parseProject` for internal core unit tests, as it is heavy and meant for end-to-end usage.
* **Test Exclusions**: The `tsconfig.json` explicitly excludes `src/**/*.test.ts`. This prevents test files from being evaluated by our internal architectural rules and keeps them out of the production npm bundle.

## 5. Development Reminders

* When modifying the `vite.config.ts`, remember to externalize Node built-ins appropriately (e.g., `node:path`, `node:fs`).
* The unified regex-based API (`matchNamePattern`) supports both `RegExp` objects and strings. Make sure all locators (`FileLocator`, `ClassLocator`, etc.) consistently support this interface.

# Developer Workflow & Code Quality

Guidelines for code quality, linting, testing, and standard development rules in the Archest repository.

## Mandatory Agent Workflow

Before concluding any task or reporting success to the user, you **MUST** ensure both code quality and test integrity by running the following commands:

1. **Linting & Formatting**: 
   ```bash
   pnpm check
   ```
   *This runs Biome. All files must pass linting without warnings. See the Linting Rules section below.*

2. **Building & Testing (TS/JS/Node)**:
   ```bash
   pnpm build && pnpm -r test
   ```
   *Because the `examples/` workspaces consume the core framework, you MUST run `pnpm build` inside `packages/vitest-arch` before running the workspace tests (`pnpm -r test`).*

3. **Building & Testing (JVM)**:
   ```bash
   cd jvm && ./gradlew test
   ```
   *Runs the JUnit 6 and Kotest integration test suites under JDK 26.*

---

## Linting Rules & Biome

* **Strict Biome Compliance**: We use `biome` for all linting and formatting. 
* **DO NOT** disable global rules in `biome.json`.
* If you must use `any` (e.g., when mocking complex `ts.Program` objects in tests) or non-null assertions (`!`), use inline suppression comments with a justification:
  ```typescript
  // biome-ignore lint/suspicious/noExplicitAny: Mocking TS types for tests
  const program = {} as any;
  ```

---

## Development Reminders

* **Node Built-ins**: When modifying the `vite.config.ts`, remember to externalize Node built-ins appropriately (e.g., `node:path`, `node:fs`).
* **Regex Matchers**: The unified regex-based API (`matchNamePattern`) supports both `RegExp` objects and strings. Make sure all locators (`FileLocator`, `ClassLocator`, etc.) consistently support this interface.

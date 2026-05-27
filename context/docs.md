# User Documentation & Guides (Docusaurus)

Guidelines on maintaining the user-facing Docusaurus documentation and keeping it aligned with implementation changes.

## Directory Structure

All user documentation resides in the `docs/` subproject:
- `docs/docs/guides/`: General user guides (e.g. `parse-project.md`, `file-rules.md`, `class-rules.md`, `function-rules.md`, `property-rules.md`, `slices.md`, `layered-architecture.md`).
- `docs/docs/api/`: Reference docs for JS/TS (Vitest/Jest) generated via TypeDoc, and manual reference guides for JUnit 6 and Kotest (e.g. `docs/docs/api/junit6/README.md`, `docs/docs/api/kotest/README.md`).

## Core Documentation Rules

* **Feature Parity Alignment**: Any new feature, locator query option, rule check, or assertion matcher added to any platform (Node or JVM) **MUST** be immediately documented in the corresponding files under `docs/docs/guides/`.
* **Multi-Platform Code Tabs**:
  - Always use Docusaurus `<Tabs>` and `<TabItem>` components to showcase side-by-side examples.
  - Maintain the following standard configuration for tab identifiers and labels:
    - JS/TS (Vitest/Jest): `value="ts"` / `label="TypeScript / JS"` or `value="ts" / label="Vitest / Jest"`
    - JUnit 6 (Java): `value="junit6"` / `label="JUnit 6 (Java)"`
    - Kotest (Kotlin DSL): `value="kotest"` / `label="Kotest (Kotlin DSL)"`
    - In general, use `groupId="language-tabs"` to keep selected language tabs synchronized across sections.
* **Available Matchers Lists**: At the bottom of each guide, update the "Available Matchers" list to enumerate all supported matcher methods on the locator for both JS/TS and JVM (JUnit 6 / Kotest).

## Local Development & Verification

To build and run the documentation server locally to verify your changes:

1. Navigate to the `docs/` directory:
   ```bash
   cd docs
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the local development server:
   ```bash
   pnpm start
   ```
   *Note: This automatically triggers `typedoc` compilation to generate API docs beforehand.*
4. Open your browser to `http://localhost:3000` to review the rendered guides.

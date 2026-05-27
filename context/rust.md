# Rust Backend & NAPI Bindings

The framework delegates heavy-lifting parsing and graph/cycle detection tasks to a native Rust crate (`packages/core-rust`).

## Core Concepts

* **NAPI Bindings**: The Rust code is compiled to native Node.js addons (`.node`) using `napi-rs`. When modifying the Rust backend, you must run `pnpm build` in the `core-rust` directory to regenerate the index files.
* **Native State Isolation**: The `ArchestProject` instance is passed down via locators. Because Vitest deep-clones values passed to `expect()`, the native `archestProject` property is made non-enumerable to prevent Vitest from stripping its C++ pointers during test assertion logging.
* **Vue/Svelte Support**: We extract the contents of `<script>` blocks from `.vue` and `.svelte` files and parse them using `tree-sitter` in the Rust engine.
* **Testing Native Integrations**: When writing unit tests in TypeScript that require mock AST data, use the `createMockArchestProject` factory method from `testUtils.ts` to seamlessly bridge plain JSON mock definitions into a native `ArchestProject` instance.

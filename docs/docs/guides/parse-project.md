---
sidebar_position: 0
---

# Project Parsing

The `parseProject` function is the main entry point to Archest. It reads your project's `tsconfig.json` to discover files, resolves paths and aliases, and invokes the native Rust backend to parse the Abstract Syntax Trees (ASTs) and build a dependency graph.

## Initialization

You should initialize the project at the top level of your test suite (inside your `describe` block). This ensures that the heavy AST parsing and graph traversal only occurs once per test suite, making your subsequent assertions incredibly fast.

```typescript
import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, it } from 'vitest';

// 1. Setup Vitest matchers globally
setupMatchers();

describe('Architecture Rules', () => {
  // 2. Parse the project once for this suite
  const project = parseProject();

  it('example rule', () => {
    // ...
  });
});
```

## Configuration Options

By default, `parseProject()` will automatically look for a `tsconfig.json` in your current working directory and use its `include` and `exclude` rules to discover TypeScript files.

You can customize this behavior by passing an options object to `parseProject`:

```typescript
export interface ParseProjectOptions {
  /**
   * Explicit path to a tsconfig.json file.
   * Useful if your tests run in a different directory than the root project.
   */
  tsConfigFilePath?: string;

  /**
   * Override the `include` globs from the tsconfig.json.
   * Only files matching these patterns will be parsed and evaluated by Archest.
   */
  include?: string[];

  /**
   * Override the `exclude` globs from the tsconfig.json.
   * Files matching these patterns will be completely ignored.
   */
  exclude?: string[];
}
```

### Example: Custom Include/Exclude

If you want to run architectural tests against your `src/` folder but want to ensure that `*.test.ts` or `*.spec.ts` files are not accidentally evaluated as part of your architecture:

```typescript
const project = parseProject({
  include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.svelte'],
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/types/**'],
});
```

## The Project Instance

Once initialized, the returned `project` instance provides the locators needed to query specific architectural elements in your codebase:

- `project.getFiles(options)` - Search for specific files or groups of files.
- `project.getClasses(options)` - Search for specific classes.
- `project.getFunctions(options)` - Search for specific functions.
- `project.getProperties(options)` - Search for specific properties inside classes.
- `project.layeredArchitecture()` - Launch the Layered Architecture API builder.
- `project.getSlices(pattern)` - Define Macro-Architectural Slices.

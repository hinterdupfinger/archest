---
sidebar_position: 1
---

# File Rules & Dependency Checks

File rules allow you to query your project files by path and assert rules about their imports and dependencies. This is the foundation of preventing "spaghetti code" and circular dependencies in your project.

## Finding Files
Start by calling `project.getFiles(options)`.

You can filter files using the `FileQueryOptions` object:
- **`inFolder`**: Finds files whose absolute path includes the exact folder string (e.g., `'services'`).
- **`matchNamePattern`**: Restricts the query to files whose name matches the given pattern (string or RegExp).

```typescript
const serviceFiles = project.getFiles({ inFolder: 'services' });
const indexFiles = project.getFiles({ matchNamePattern: /.*\/index\.ts$/ });
```

## Dependency Checks

Assert that files do or do not depend on other specific packages using native matchers. Archest automatically resolves TypeScript aliases and paths via your `tsconfig.json`.

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();
const uiComponents = project.getFiles({ inFolder: 'components' });

// Ensure UI components NEVER import directly from the database layer
expect(uiComponents).not.toDependOnFilesInFolder('database');

// Ensure controllers depend on services
const controllers = project.getFiles({ inFolder: 'controllers' });
expect(controllers).toDependOnFilesInFolder('services');
```

## Cycle Detection

Circular dependencies cause massive runtime issues and memory leaks. You can ask the framework to recursively resolve the imports of your files and guarantee that they are strictly free of cyclic dependencies.

```typescript
const coreFiles = project.getFiles({ inFolder: 'core' });

// Traverses the entire AST import graph of the 'core' folder to detect cycles (e.g., A -> B -> C -> A)
expect(coreFiles).toBeFreeOfCycles();
```

## Structural Metrics & Limits

You can enforce limits on the complexity and export structure of your files directly:

```typescript
const coreFiles = project.getFiles({ inFolder: 'core' });

// Ensure files are maintainable
expect(coreFiles).toHaveMaxCyclomaticComplexity(100);
expect(coreFiles).toHaveMinMaintainabilityIndex(20);

// Enforce single-responsibility principle by limiting exports
expect(coreFiles).toHaveMaxExportedFunctions(1);
```

## Available Matchers

- `.toDependOnFilesInFolder(folder: string)`
- `.toBeFreeOfCycles()`
- `.toMatchNamePattern(pattern: string | RegExp)`
- `.toHaveMaxExportedFunctions(max: number)`
- `.toHaveMaxCyclomaticComplexity(max: number)`
- `.toHaveMinMaintainabilityIndex(min: number)`

:::warning[Gotcha: External Libraries]
`toDependOnFilesInFolder` ignores external library imports (node_modules). It is strictly used for checking internal monorepo/project dependencies.
:::

:::danger[Anti-Pattern: Massive Cycle Checks]
Running `.toBeFreeOfCycles()` on `project.getFiles()` (which grabs the *entire* codebase) can be extremely slow on large monorepos because it calculates a global directed graph. Instead, prefer running cycle checks on specific domain bounds (e.g. `project.getFiles({ inFolder: 'domainA' }).toBeFreeOfCycles()`).
:::

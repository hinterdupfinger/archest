---
name: archest
description: Write architecture tests using @archest/vitest to enforce strict folder, layer, and dependency boundaries.
---

# Writing Architecture Tests with @archest/vitest

When tasked with writing or modifying architecture tests, follow these guidelines to use `@archest/vitest` effectively. `@archest/vitest` is a static AST analyzer that natively integrates with Vitest to enforce boundaries in TypeScript projects.

## Core Setup

Always import `parseProject` and `setupMatchers` from `@archest/vitest` at the top of your test file. Call `setupMatchers()` before parsing the project.

```typescript
import { describe, it, expect } from 'vitest';
import { parseProject, setupMatchers } from '@archest/vitest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject();
  // ...
});
```

## Locating Code Elements

Use the `project` instance to query the codebase. Use options to filter results.

### Files
```typescript
// Find files by folder
const controllers = project.getFiles({ inFolder: 'controllers' });

// Find files by pattern (supports wildcards)
const graphqlFiles = project.getFiles({ matchNamePattern: /.*\.graphql\.ts$/ });
```

### Classes
```typescript
// Find classes with a specific decorator or suffix
const services = project.getClasses({ withDecorator: 'Injectable' });
const daos = project.getClasses({ matchNamePattern: /Dao$/ });
```

### Functions
```typescript
// Find top-level standalone functions (ignoring class methods)
const hooks = project.getFunctions({ matchNamePattern: /^use/, isTopLevel: true });
```

## Available Matchers

Use native Vitest `expect()` chains with the custom matchers provided by Archest. You can use `.not` to negate any matcher.

### Structural Matchers (Files & Folders)
- `.toDependOnFilesInFolder(folderName)`: Asserts that files import from the specified folder.
- `.toResideInFolder(folderName)`: Asserts that classes physically reside in the given folder.
- `.toMatchNamePattern(regexOrString)`: Asserts that a File, Class, or Function name matches a specific RegExp or string pattern.
- `.toHaveNameMatchingFileName()`: Asserts that an exported Class or Function has a name matching its filename.
- `.toHaveMaxExportedFunctions(max)`: Asserts that a File does not export more than the maximum number of functions.

### Object-Oriented Matchers (Classes)
- `.toExtendClass(className)`: Asserts a class `extends` a base class.
- `.toImplementInterface(interfaceName)`: Asserts a class `implements` an interface.
- `.toHaveModifier('export' | 'default' | 'abstract')`: Asserts a class or function has a specific AST modifier.

### Functional Matchers (Functions)
- `.toHaveExplicitReturnType()`: Asserts that a function explicitly declares a return type.

### Macro Architecture Matchers
- `.toBeFreeOfCycles()`: Performs a deep AST graph traversal to ensure the files have zero circular dependencies. **Note**: Call this on specific domain bounds (e.g., `project.getFiles({ inFolder: 'domain' }).toBeFreeOfCycles()`) rather than the entire project for performance.

### Structural Metrics
- `.toHaveMaxCyclomaticComplexity(max)`: Asserts that a File, Class, or Function does not exceed a maximum cyclomatic complexity.
- `.toHaveMinMaintainabilityIndex(min)`: Asserts that a File or Function has at least the minimum Maintainability Index.
- `.toHaveMaxDistanceFromMainSequence(max)`: Asserts that an Architectural Slice has a maximum Distance from the Main Sequence (balance between Abstractness and Instability).

## Examples

### Enforcing Layer Separation (File Queries)
```typescript
it('UI should not access database layer directly', () => {
  const ui = project.getFiles({ inFolder: 'ui' });
  expect(ui).not.toDependOnFilesInFolder('database');
});
```

### Enforcing Strict N-Tier Layers (Layered Architecture Builder)
For more complex domains, use the Layered Architecture builder to define multiple layers and their relationships at once.
```typescript
it('should enforce strict layer boundaries', () => {
  const architecture = project.layeredArchitecture()
    .layer('Domain', 'domain')
    .layer('Application', 'application')
    .layer('Infrastructure', 'infrastructure');

  expect(architecture.whereLayer('Domain').shouldNotAccessAnyLayer().check()).toPass();
  expect(architecture.whereLayer('Application').shouldOnlyBeAccessedBy('Infrastructure').check()).toPass();
});
```

### Enforcing Naming Conventions
```typescript
it('All controllers must be properly named', () => {
  const decorated = project.getClasses({ withDecorator: 'Controller' });
  expect(decorated).toMatchNamePattern(/Controller$/);
});
```

---
name: archest
description: >
  Use this skill when the user wants to write, modify, or verify architecture tests, fitness functions, or structural rules. Apply this when the user needs to enforce folder boundaries, layer separation, naming conventions, or dependency restrictions in TypeScript projects, even if they don't explicitly mention "@archest/vitest".
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

## Step-by-Step Workflow (Plan-Validate-Execute)

When tasked with writing an architecture test, use the following procedural workflow:

1. **Plan & Analyze**: Identify the specific architectural rule or fitness function the user wants to enforce (e.g., "Domain layer must not depend on UI").
2. **Query (Locate)**: Use `parseProject()` to isolate the relevant structural elements (Files, Classes, Functions, or Slices).
3. **Assert (Execute)**: Apply the correct structural matcher to the located elements.
4. **Validate**: Always run the test (e.g., `vitest run` or `pnpm build && pnpm -r test` in a monorepo) to verify the rule passes against the current codebase. Fix any violations or adjust the rule if it was too strict.

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
- `.toBeFreeOfCycles()`: Performs a deep AST graph traversal to ensure the files have zero circular dependencies.

### Structural Metrics
- `.toHaveMaxCyclomaticComplexity(max)`: Asserts that a File, Class, or Function does not exceed a maximum cyclomatic complexity.
- `.toHaveMinMaintainabilityIndex(min)`: Asserts that a File or Function has at least the minimum Maintainability Index.
- `.toHaveMaxDistanceFromMainSequence(max)`: Asserts that an Architectural Slice has a maximum Distance from the Main Sequence (balance between Abstractness and Instability).

## Evolutionary Architecture & Fitness Functions

Archest is designed to be a tool for **Evolutionary Architecture**. As systems evolve, their architectural characteristics (e.g., modularity, coupling, maintainability) often degrade over time. 

To protect against this, you should write tests that act as **Automated Architectural Fitness Functions**. 
- **Metrics as Fitness Functions**: Use Archest's structural metrics (`toHaveMaxCyclomaticComplexity`, `toHaveMinMaintainabilityIndex`, `toHaveMaxDistanceFromMainSequence`) to establish quantitative fitness functions that track the health and agility of the codebase.
- **Preventing Drift**: By running these tests automatically, you establish a mechanism that prevents "architectural drift" during iterative development.

## Best Practices for Architecture Tests

When writing architectural tests, follow these industry-standard best practices:

1. **Focus on High-Value Rules**: Prioritize critical boundaries (e.g., Domain independence, acyclic dependencies) over overly granular or noisy rules. Only enforce rules you are prepared to maintain.
2. **Keep Tests Simple & Focused**: Each architecture test should validate exactly *one* rule. This ensures that failures are isolated and easy to diagnose.
3. **Use Descriptive Naming**: Name tests as living documentation. Use `it('Domain layer must remain independent of Infrastructure')` instead of `it('Check layers')`.
4. **Treat as Living Documentation**: Well-written architecture tests serve as an accurate, up-to-date roadmap of your design. They act as the single source of truth for onboarding new developers to the project's dependency rules.
5. **Continuous Integration**: These rules must run automatically on every Pull Request to catch violations before they are merged into the main branch.

## Gotchas

- **Performance of Cycle Detection**: The `.toBeFreeOfCycles()` matcher performs a deep AST graph traversal. Calling this on the entire project is computationally expensive. Always scope it to specific domain bounds (e.g., `project.getFiles({ inFolder: 'domain' }).toBeFreeOfCycles()`).
- **AST Binding (TypeScript Compiler API)**: If you are manually creating synthetic AST nodes for unit tests or working deep within the `ts.Program`, remember that the TypeScript compiler requires calling `program.getTypeChecker()` to bind the AST and populate `.parent` pointers.

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

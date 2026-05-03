---
sidebar_position: 3
---

# Layered Architecture

Inspired directly by ArchUnit, the Layered Architecture builder allows you to explicitly map folder patterns to named architectural layers, and then assert cross-talk boundaries. This is highly effective for strictly enforcing N-Tier architectures (e.g., UI -> Services -> Data Access).

## Defining Layers

Use `project.layeredArchitecture()` to begin building your layers. You can define as many layers as you want by passing a Layer Name and a Folder Matcher.

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

const architecture = project.layeredArchitecture()
  .layer('Controllers', 'controllers')
  .layer('Services', 'services')
  .layer('Repositories', 'repositories');
```

## Asserting Boundaries

Once your layers are defined, you use a fluent syntax to define what is and isn't allowed to communicate.

```typescript
// Example 1: Restrict Access Globally
// Controllers represent the entrypoint; they cannot be imported by any other layer
const rule1 = architecture
  .whereLayer('Controllers').shouldNotBeAccessedByAnyLayer()
  .check();

expect(rule1).toPass();

// Example 2: Strict Sequential Access
// Repositories manage data access and should ONLY be accessed by the business logic (Services) layer
const rule2 = architecture
  .whereLayer('Repositories').shouldOnlyBeAccessedBy('Services')
  .check();

expect(rule2).toPass();
```

## Available Matchers

- `.toPass()`: Evaluates the rules configured on the Layered Architecture builder. You can append `.not.toPass()` to assert that an architecture is *supposed* to fail (useful for testing Archest itself, but rarely used in production codebases).

:::warning[Gotcha: Layer Access Includes Sub-directories]
When you define a layer with `.layer('Services', 'services')`, any file inside `services/` or `services/sub-folder/` is considered part of the Services layer. 
:::

:::danger[Anti-Pattern: Skipping Layers]
The Layered Architecture builder does not implicitly prevent "skipping" layers (e.g., Controllers talking directly to Repositories). If you define a `.shouldOnlyBeAccessedBy('Services')` rule on Repositories, it inherently blocks Controllers from accessing Repositories. But if you forget to add that rule, Controllers *will* be able to access Repositories. Always define access rules for your deepest layers!
:::

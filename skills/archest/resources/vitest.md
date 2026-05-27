# @archest/vitest - Architecture Testing for Vitest

Enforce folder boundaries, naming conventions, and dependency rules in TypeScript/JavaScript projects using Vitest.

## Installation
```bash
pnpm add -D @archest/vitest
```

## Setup & Usage

Call `setupMatchers()` at the top of your test suite. Use `parseProject()` to build the AST graph:

```typescript
import { describe, it, expect } from 'vitest';
import { parseProject, setupMatchers } from '@archest/vitest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject({
    exclude: ['**/*.test.ts']
  });

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });
});
```

See a full template example in [VitestArchitectureTest.ts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/VitestArchitectureTest.ts).

## API & Matchers Reference

### Query Options
*   `project.getFiles({ inFolder, matchNamePattern })`
*   `project.getClasses({ inFolder, matchNamePattern, withDecorator, extending, implementing, havingModifier })`
*   `project.getFunctions({ inFolder, matchNamePattern, isTopLevel })`
*   `project.getProperties({ inFolder, matchNamePattern })`

### Available Matchers
*   `expect(files).toBeFreeOfCycles()`
*   `expect(files).toDependOnFilesInFolder(folder)`
*   `expect(files).toDependOnExternalModule(module)`
*   `expect(classes).toResideInFolder(folder)`
*   `expect(classes).toExtendClass(className)`
*   `expect(classes).toImplementInterface(interfaceName)`
*   `expect(properties).toBeReadonly()`

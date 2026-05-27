# @archest/jest - Architecture Testing for Jest

Enforce architectural constraints and AST rules in JavaScript/TypeScript projects using Jest.

## Installation
```bash
npm install --save-dev @archest/jest
```

## Setup & Usage

```typescript
import { parseProject, setupMatchers } from '@archest/jest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject();

  it('domain should not depend on infrastructure', () => {
    const domain = project.getFiles({ inFolder: 'domain' });
    expect(domain).not.toDependOnFilesInFolder('infrastructure');
  });
});
```

See a full template example in [JestArchitectureTest.ts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/JestArchitectureTest.ts).

## API & Matchers Reference

Matches the Vitest API options and Custom Matchers.
*   `expect(files).toBeFreeOfCycles()`
*   `expect(files).toDependOnFilesInFolder(folder)`
*   `expect(files).toDependOnExternalModule(module)`

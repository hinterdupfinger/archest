<img src="./docs/static/img/archest.png" alt="Archest Logo" width="300" />


# Archest

**Enforce strict architectural boundaries directly in your Vitest suite.**

Archest is an architecture testing tool for TypeScript, heavily inspired by ArchUnit and Konsist. It allows you to assert formatting, naming, structural requirements, and dependency boundaries across your entire codebase using native Vitest matchers.

## Features

- ⚡️ **Native Performance**: Parses your AST and builds dependency graphs natively using a blazing-fast Rust backend (`@archest/core-rust`) powered by `tree-sitter`. No heavy external Java dependencies.
- 🧪 **Native Vitest Matchers**: Seamlessly hooks into Vitest. Get instant feedback on your architecture in your existing CI/CD pipelines right next to your unit tests.
- 🔄 **Cycle Detection**: Automatically traverses your dependency graph to prevent circular imports and spaghetti code at both the file and macro-domain level.
- 🧱 **Layered Architecture**: Strictly enforce N-Tier architectures (e.g., UI -> Services -> Data Access) with a fluent API.
- 📏 **Structural Metrics**: Calculate and enforce maximum Cyclomatic Complexity, minimum Maintainability Index, and Distance from the Main Sequence.
- 🏗 **Framework Agnostic**: Works perfectly with Next.js, NestJS, Vue, React, or vanilla TypeScript.

## Quick Start

### 1. Install

```bash
npm install -D @archest/vitest vitest
```
*(Also available via `pnpm`, `yarn`, or `bun`)*

### 2. Setup Matchers

Create a setup file for Vitest or import the matchers directly in your test file:

```typescript
// architecture.test.ts
import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, it, expect } from 'vitest';

setupMatchers();

describe('Architecture Rules', () => {
  // Automatically loads tsconfig.json. You can optionally pass `include` and `exclude` 
  // arrays to explicitly filter which files are parsed by the Rust AST engine.
  const project = parseProject({
    exclude: ['**/*.test.ts']
  });

  it('UI components must not access database logic directly', () => {
    const uiComponents = project.getFiles({ inFolder: 'components/ui' });
    expect(uiComponents).not.toDependOnFilesInFolder('database');
  });

  it('Controllers must reside in the controllers folder', () => {
    const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
    expect(controllers).toResideInFolder('controllers');
  });
});
```

### 3. Run Tests

```bash
vitest run architecture.test.ts
```

## Documentation

For full API documentation, locators, matchers, and advanced usage (like Cycle Detection and Layered Architecture), visit the official documentation:

👉 **[Archest Documentation](https://hinterdupfinger.github.io/archest/)**

## 🤖 AI Agent Skill

Archest ships with an official Agent Skill for the [Vercel Labs open skills ecosystem](https://github.com/vercel-labs/skills). 

By installing this skill, you can empower AI coding agents (like Claude Code, Cursor, Windsurf, or Antigravity) with the exact knowledge of how to write and update your Archest tests!

```bash
npx skills add github.com/hinterdupfinger/archest/tree/main/skills/archest
```

## Examples

We provide several example projects demonstrating how to use Archest to enforce framework-specific conventions:

- [NestJS Usage](./examples/nestjs-usage) - Enforces `@Controller` and `@Injectable` decorators, strict layer access, and readonly properties in DTOs.
- [Next.js Usage](./examples/nextjs-usage) - Enforces that Server Actions in the `actions/` folder are async and exported, and prevents `components/ui` from fetching data/actions directly.
- [Vue Usage](./examples/vue-usage) - Enforces that Composables are exported functions starting with `use`, and blocks dumb components from importing the global state directly.

## License

MIT

<img src="./docs/static/img/archest.png" alt="Archest Logo" width="300" />


# Archest

**Enforce strict architectural boundaries directly in Vitest, Jest, JUnit 6, or Kotest.**

Archest is an architecture testing tool for JavaScript, TypeScript, Java, and Kotlin, heavily inspired by ArchUnit and Konsist. It allows you to assert formatting, naming, structural requirements, and dependency boundaries across your entire codebase using native Vitest/Jest matchers or JUnit 6/Kotest assertions.

## Features

- ⚡️ **Native Performance**: Parses your AST and builds dependency graphs natively using a blazing-fast Rust backend (`@archest/core-rust`) powered by `tree-sitter`. Uses high-speed native JNI bindings in the JVM environment.
- 🧪 **Multi-Platform Integration**: Seamlessly hooks into Vitest/Jest for JS/TS, and JUnit 6/Kotest for the JVM. Get instant feedback on your architecture in your existing CI/CD pipelines right next to your unit tests.
- 🔄 **Cycle Detection**: Automatically traverses your dependency graph to prevent circular imports and spaghetti code at both the file and macro-domain level.
- 🧱 **Layered Architecture**: Strictly enforce N-Tier architectures (e.g., UI -> Services -> Data Access) with a fluent, unified API.
- 📏 **Structural Metrics**: Calculate and enforce maximum Cyclomatic Complexity, minimum Maintainability Index, and Distance from the Main Sequence.
- 🏗 **Framework Agnostic**: Works perfectly with Next.js, NestJS, Vue, React, Spring Boot, Quarkus, or vanilla Java/Kotlin projects.

## Quick Start

### 1. JavaScript & TypeScript (Vitest / Jest)

#### Install
```bash
# For Vitest projects
npm install -D @archest/vitest vitest

# For Jest projects
npm install -D @archest/jest jest
```

#### Write Test (Vitest)
```typescript
import { parseProject, setupMatchers } from '@archest/vitest';
import { describe, it, expect } from 'vitest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject({ exclude: ['**/*.test.ts'] });

  it('UI components must not access database logic directly', () => {
    const uiComponents = project.getFiles({ inFolder: 'components/ui' });
    expect(uiComponents).not.toDependOnFilesInFolder('database');
  });
});
```

#### Write Test (Jest)
```typescript
import { parseProject, setupMatchers } from '@archest/jest';

setupMatchers();

describe('Architecture Rules', () => {
  const project = parseProject({ exclude: ['**/*.test.ts'] });

  it('UI components must not access database logic directly', () => {
    const uiComponents = project.getFiles({ inFolder: 'components/ui' });
    expect(uiComponents).not.toDependOnFilesInFolder('database');
  });
});
```

#### Run
```bash
# For Vitest
vitest run architecture.test.ts

# For Jest
jest architecture.test.ts
```

### 2. JVM Environment (JUnit 6 / Kotest)

#### Install (Gradle Kotlin DSL)
Add the GitHub Packages maven repository and dependencies:
```kotlin
repositories {
    mavenCentral()
    maven { url = uri("https://maven.pkg.github.com/hinterdupfinger/archest") }
}

dependencies {
    testImplementation("org.archest:archest-junit6:0.1.0")
}
```

#### Write Test (JUnit 6)
```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;
import org.junit.jupiter.api.Test;

public class ArchitectureTest {
    @Test
    public void testLayerBoundaries() {
        ArchestProject project = ArchestProject.parse(files);
        
        FileLocator domain = project.getFiles(new FileQueryOptions().inFolder("domain"));
        ArchestAssertions.assertThat(domain).notToDependOnFilesInFolder("infrastructure");
    }
}
```

#### Run
```bash
./gradlew test
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

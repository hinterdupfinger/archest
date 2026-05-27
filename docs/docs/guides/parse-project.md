---
sidebar_position: 0
---

# Project Parsing

Before Archest can enforce architectural rules, it must parse your source files and build a dependency graph. Archest uses a high-performance native Rust core backend to read and parse Abstract Syntax Trees (ASTs) for JavaScript, TypeScript, Java, and Kotlin.

---

## 1. JavaScript & TypeScript (Vitest / Jest)

The `parseProject` function is the main entry point to Archest in JS/TS. It reads your project's `tsconfig.json` to discover files, resolves paths and aliases, and invokes the native backend to build the dependency graph.

### Initialization

You should initialize the project at the top level of your test suite (inside your `describe` block). This ensures that AST parsing only occurs once per test suite, making your subsequent assertions incredibly fast.

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

### Configuration Options

By default, `parseProject()` will automatically look for a `tsconfig.json` in your current working directory and use its `include` and `exclude` rules to discover TypeScript files.

You can customize this behavior by passing an options object to `parseProject`:

```typescript
export interface ParseProjectOptions {
  /** Explicit path to a tsconfig.json file. */
  tsConfigFilePath?: string;
  /** Override the `include` globs from the tsconfig.json. */
  include?: string[];
  /** Override the `exclude` globs from the tsconfig.json. */
  exclude?: string[];
}
```

#### Example: Custom Include/Exclude
```typescript
const project = parseProject({
  include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.svelte'],
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/types/**'],
});
```

---

## 2. JVM Environment (JUnit 6 & Kotest)

In the JVM environment, project parsing can be done either **programmatically** or **declaratively**.

### Programmatic Parsing (Java & Kotlin)

You can programmatically locate your source files and pass their absolute paths to the static `ArchestProject.parse` method.

#### Java Example
```java
import org.archest.core.ArchestProject;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

List<String> files = new ArrayList<>();
locateSourceFiles(new File("src/main/java"), files);

ArchestProject project = ArchestProject.parse(files);
```

#### Kotlin Example (with Kotest)
```kotlin
import org.archest.core.ArchestProject
import java.io.File

val files = locateSourceFiles(File("src/main/kotlin"))
val project = ArchestProject.parse(files)
```

### Declarative Parsing (JUnit 6 Extension)

JUnit 6 supports declarative parsing via class annotations. When using `@ExtendWith(ArchestExtension.class)` and `@AnalyzeClasses`, Archest automatically scans your project and parses the target classes before running your test rules.

```java
import org.archest.junit6.*;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(ArchestExtension.class)
@AnalyzeClasses(packages = "com.example")
public class ArchitectureTest {
    
    @ArchTest
    public static final ArchestRule repositoryShouldNotDependOnController =
        ArchestRules.classes()
            .matching(".*Repository")
            .shouldNotDependOn(".*Controller");
}
```

---

## The Project Instance

Once initialized, the returned `project` instance provides a unified set of APIs across all environments (JS/TS and JVM) to query specific architectural elements:

*   `project.getFiles(options)` - Search for specific files.
*   `project.getClasses(options)` - Search for specific classes.
*   `project.getFunctions(options)` - Search for specific functions.
*   `project.getProperties(options)` - Search for specific class properties/fields.
*   `project.layeredArchitecture()` - Declare Layered Architecture.
*   `project.getSlices(pattern)` - Define Macro-Architectural Slices.

### Platform-Specific Additions

*   **JVM Only**:
    *   `project.checkFileCycles(locatorFiles, isNot)` - Direct JNI circular dependency checker.
    *   `project.getProjectData()` - Exposes Jackson-mapped raw AST metadata (packages, classes, fields, functions, and imports) for writing custom assertion logic.

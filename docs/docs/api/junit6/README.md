# @archest/junit6

`@archest/junit6` provides declarative annotations and integration extensions to write architectural tests within the JUnit 6 (Jupiter) lifecycle.

---

## 1. Annotations

### `@AnalyzeClasses`
Specifies which packages and classes Archest should scan and analyze before running test rules.

*   **Target**: `ElementType.TYPE` (Class level)
*   **Parameters**:
    *   `packages`: `String[]` - Array of package names to match during AST analysis (e.g. `packages = {"com.example"}`).

```java
@AnalyzeClasses(packages = {"com.example"})
public class MyArchitectureTest { ... }
```

### `@ArchTest`
Marks a static field containing an `ArchestRule` to be run automatically by the `ArchestExtension` lifecycle hook.

*   **Target**: `ElementType.FIELD` (Field level)
*   **Requirements**: The annotated field must be both `static` and assignable to type `ArchestRule`.

```java
@ArchTest
public static final ArchestRule myRule = ...
```

---

## 2. Extensions & Lifecycle Hooks

### `ArchestExtension`
A JUnit Jupiter extension implementing `BeforeAllCallback` that automatically scans classes, builds the AST dependency graph, and runs all `@ArchTest` rules declared in the test class.

*   **Usage**: Registered via `@ExtendWith(ArchestExtension.class)` (applied automatically by `@AnalyzeClasses`).

```java
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(ArchestExtension.class)
@AnalyzeClasses(packages = "com.example")
public class ArchitectureTest { ... }
```

---

## 3. Query API & Locators

You can query the AST using fluent locators directly from `ArchestProject`:

*   `project.getFiles()` or `project.getFiles(FileQueryOptions)` - Returns a `FileLocator`
*   `project.getClasses()` or `project.getClasses(ClassQueryOptions)` - Returns a `ClassLocator`
*   `project.getFunctions()` or `project.getFunctions(FunctionQueryOptions)` - Returns a `FunctionLocator`
*   `project.getProperties()` or `project.getProperties(PropertyQueryOptions)` - Returns a `PropertyLocator`
*   `project.getSlices(String pattern)` - Returns a `SliceLocator` grouped by the wildcard matching pattern.
*   `project.layeredArchitecture()` - Returns a `LayeredArchitecture` builder.

### Query Options Builders

Use option builders to filter your queries:

- `new ClassQueryOptions().inFolder("domain").matchNamePattern(".*Repository")`
- `new FileQueryOptions().inFolder("repositories")`
- `new FunctionQueryOptions().isTopLevel(true).matchNamePattern("^locate.*")`
- `new PropertyQueryOptions().inFolder("dtos")`

---

## 4. Programmatic Assertions

### `ArchestAssertions`
Provides AssertJ-style assertions to check rules programmatically. Exposes target-specific assertion methods with built-in negation options:

#### Assertions on `FileLocator`
- `.toBeFreeOfCycles()` / `.notToBeFreeOfCycles()`
- `.toDependOnFilesInFolder(String folder)` / `.notToDependOnFilesInFolder(String folder)`
- `.toDependOnExternalModule(String pattern)` / `.notToDependOnExternalModule(String pattern)`
- `.toMatchNamePattern(String regex)` / `.notToMatchNamePattern(String regex)`
- `.toHaveMaxCyclomaticComplexity(long max)` / `.notToHaveMaxCyclomaticComplexity(long max)`
- `.toHaveMinMaintainabilityIndex(long min)` / `.notToHaveMinMaintainabilityIndex(long min)`
- `.toHaveMaxExportedFunctions(long max)` / `.notToHaveMaxExportedFunctions(long max)`

#### Assertions on `ClassLocator`
- `.toResideInFolder(String folder)` / `.notToResideInFolder(String folder)`
- `.toHaveModifier(String modifier)` / `.notToHaveModifier(String modifier)` (supports `export`, `default`, `abstract`)
- `.toExtendClass(String className)` / `.notToExtendClass(String className)`
- `.toImplementInterface(String interfaceName)` / `.notToImplementInterface(String interfaceName)`
- `.toMatchNamePattern(String regex)` / `.notToMatchNamePattern(String regex)`
- `.toHaveMaxCyclomaticComplexity(long max)` / `.notToHaveMaxCyclomaticComplexity(long max)`
- `.toHaveNameMatchingFileName()` / `.notToHaveNameMatchingFileName()`

#### Assertions on `FunctionLocator`
- `.toHaveModifier(String modifier)` / `.notToHaveModifier(String modifier)` (supports `export`, `async`)
- `.toHaveExplicitReturnType()` / `.notToHaveExplicitReturnType()`
- `.toMatchNamePattern(String regex)` / `.notToMatchNamePattern(String regex)`
- `.toHaveMaxCyclomaticComplexity(long max)` / `.notToHaveMaxCyclomaticComplexity(long max)`
- `.toHaveMinMaintainabilityIndex(long min)` / `.notToHaveMinMaintainabilityIndex(long min)`
- `.toHaveNameMatchingFileName()` / `.notToHaveNameMatchingFileName()`

#### Assertions on `PropertyLocator`
- `.toBeReadonly()` / `.notToBeReadonly()`

#### Assertions on `SliceLocator`
- `.toBeFreeOfCycles()` / `.notToBeFreeOfCycles()`
- `.toHaveMaxDistanceFromMainSequence(double max)` / `.notToHaveMaxDistanceFromMainSequence(double max)`

#### Assertions on `LayeredArchitecture`
- `.toPass()`

---

## 5. Examples

### Checking Class Dependency & Files
```java
ArchestProject project = ArchestProject.parse(files);

// Filter classes in services layer
ClassLocator services = project.getClasses(new ClassQueryOptions().inFolder("services"));

// Assert classes in services layer do not extend BaseController
ArchestAssertions.assertThat(services)
    .notToExtendClass("BaseController");

// Check files cycle freedom
ArchestAssertions.assertThat(project.getFiles())
    .toBeFreeOfCycles();
```

### Checking Slices & Layered Architecture
```java
// Assert slices are within the main sequence bounds
SliceLocator slices = project.getSlices("src/domain/*");
ArchestAssertions.assertThat(slices).toHaveMaxDistanceFromMainSequence(0.8);

// Assert Layered Architecture
LayeredArchitecture layered = project.layeredArchitecture()
    .layer("Repositories", "repositories")
    .layer("Services", "services")
    .layer("Controllers", "controllers");

layered.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services", "Controllers");
layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers");

ArchestAssertions.assertThat(layered).toPass();
```

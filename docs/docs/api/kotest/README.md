# @archest/kotest

`@archest/kotest` provides Kotlin-first extension functions and DSL matchers to write idiomatic architecture tests in [Kotest](https://kotest.io/).

---

## 1. Querying the Project

You can query elements from `ArchestProject` using getters and optional query builders:

```kotlin
val files = project.getFiles(FileQueryOptions().inFolder("domain"))
val classes = project.getClasses(ClassQueryOptions().matchNamePattern(".*Repository"))
val functions = project.getFunctions(FunctionQueryOptions().isTopLevel(true))
val properties = project.getProperties()
val slices = project.getSlices("jvm/src/*")
val layered = project.layeredArchitecture()
```

---

## 2. Matchers DSL

We provide Kotlin extension and infix functions for all locators:

### FileLocator Matchers
- `files.shouldBeFreeOfCycles()` / `files.shouldNotBeFreeOfCycles()`
- `files shouldDependOnFilesInFolder "folder"` / `files shouldNotDependOnFilesInFolder "folder"`
- `files shouldDependOnExternalModule "module"` / `files shouldNotDependOnExternalModule "module"`
- `files shouldMatchNamePattern "pattern"` / `files shouldNotMatchNamePattern "pattern"`
- `files shouldHaveMaxCyclomaticComplexity max` / `files shouldNotHaveMaxCyclomaticComplexity max`
- `files shouldHaveMinMaintainabilityIndex min` / `files shouldNotHaveMinMaintainabilityIndex min`
- `files shouldHaveMaxExportedFunctions max` / `files shouldNotHaveMaxExportedFunctions max`

### ClassLocator Matchers
- `classes shouldResideInFolder "folder"` / `classes shouldNotResideInFolder "folder"`
- `classes shouldHaveModifier "modifier"` / `classes shouldNotHaveModifier "modifier"` (e.g. `export`, `default`, `abstract`)
- `classes shouldExtendClass "BaseClass"` / `classes shouldNotExtendClass "BaseClass"`
- `classes shouldImplementInterface "Interface"` / `classes shouldNotImplementInterface "Interface"`
- `classes shouldMatchNamePattern "pattern"` / `classes shouldNotMatchNamePattern "pattern"`
- `classes shouldHaveMaxCyclomaticComplexity max` / `classes shouldNotHaveMaxCyclomaticComplexity max`
- `classes.shouldHaveNameMatchingFileName()` / `classes.shouldNotHaveNameMatchingFileName()`

### FunctionLocator Matchers
- `functions shouldHaveModifier "modifier"` / `functions shouldNotHaveModifier "modifier"` (e.g. `export`, `async`)
- `functions.shouldHaveExplicitReturnType()` / `functions.shouldNotHaveExplicitReturnType()`
- `functions shouldMatchNamePattern "pattern"` / `functions shouldNotMatchNamePattern "pattern"`
- `functions shouldHaveMaxCyclomaticComplexity max` / `functions shouldNotHaveMaxCyclomaticComplexity max`
- `functions shouldHaveMinMaintainabilityIndex min` / `functions shouldNotHaveMinMaintainabilityIndex min`
- `functions.shouldHaveNameMatchingFileName()` / `functions.shouldNotHaveNameMatchingFileName()`

### PropertyLocator Matchers
- `properties.shouldBeReadonly()` / `properties.shouldNotBeReadonly()`

### SliceLocator Matchers
- `slices.shouldBeFreeOfCycles()` / `slices.shouldNotBeFreeOfCycles()`
- `slices shouldHaveMaxDistanceFromMainSequence max` / `slices shouldNotHaveMaxDistanceFromMainSequence max`

### LayeredArchitecture Matchers
- `layered.shouldPass()`

---

## 3. Full Example

Here is an example demonstrating the Kotest DSL:

```kotlin
package org.archest.kotest

import io.kotest.core.spec.style.StringSpec
import org.archest.core.*
import java.io.File

class ArchitectureTest : StringSpec({
    "should validate architecture rules using DSL" {
        val files = mutableListOf<String>()
        locateSourceFiles(File(System.getProperty("user.dir")), files)
        val project = ArchestProject.parse(files)

        // 1. Files should not depend on test files
        val mainFiles = project.getFiles(FileQueryOptions().matchNamePattern("src/main/"))
        mainFiles shouldNotDependOnFilesInFolder "test"

        // 2. Class checks
        val repositories = project.getClasses(ClassQueryOptions().matchNamePattern(".*Repository"))
        repositories shouldNotHaveModifier "abstract"
        repositories.shouldHaveNameMatchingFileName()

        // 3. Functions checks
        val locateFunctions = project.getFunctions(FunctionQueryOptions().matchNamePattern("^locate.*"))
        locateFunctions.shouldHaveExplicitReturnType()

        // 4. Slices checks
        val slices = project.getSlices("src/domain/*")
        slices shouldHaveMaxDistanceFromMainSequence 0.8

        // 5. Layered Architecture check
        val layered = project.layeredArchitecture()
            .layer("Repositories", "repositories")
            .layer("Services", "services")
            .layer("Controllers", "controllers")

        layered.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services", "Controllers")
        layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers")

        layered.shouldPass()
    }
})
```

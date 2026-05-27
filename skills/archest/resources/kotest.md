# org.archest:archest-kotest - Architecture Testing for Kotest

Idiomatic Kotlin extension functions and infix matchers to verify project boundaries in Kotest.

## Installation
Configure the GitHub Packages Maven repository and add the `archest-kotest` dependency. Refer to the build config templates:
*   **Gradle**: [gradle-config.gradle.kts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/gradle-config.gradle.kts)

## Setup & Usage

```kotlin
import org.archest.core.*
import org.archest.kotest.*
import io.kotest.core.spec.style.StringSpec

class MyArchitectureSpec : StringSpec({
    "should enforce boundaries" {
        val project = ArchestProject.parse(files)
        val domain = project.getFiles(FileQueryOptions().inFolder("domain"))
        domain shouldNotDependOnFilesInFolder "infrastructure"
    }
})
```

See a full template example in [KotestArchitectureSpec.kt](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/KotestArchitectureSpec.kt).

## API & Matchers Reference

Kotlin DSL supports both standard method invocations and infix notation:
*   `files.shouldBeFreeOfCycles()` / `files.shouldNotBeFreeOfCycles()`
*   `files shouldDependOnFilesInFolder folder` / `files shouldNotDependOnFilesInFolder folder`
*   `files shouldDependOnExternalModule module` / `files shouldNotDependOnExternalModule module`
*   `classes shouldResideInFolder folder` / `classes shouldNotResideInFolder folder`
*   `classes shouldExtendClass className` / `classes shouldNotExtendClass className`
*   `classes shouldImplementInterface interfaceName` / `classes shouldNotImplementInterface interfaceName`
*   `properties.shouldBeReadonly()` / `properties.shouldNotBeReadonly()`

# org.archest:archest-junit6 - Architecture Testing for JUnit 6

Enforce boundaries, naming rules, and dependency structures in Java and Kotlin projects using JUnit 6 (Jupiter).

## Installation
Configure the GitHub Packages Maven repository and add the `archest-junit6` dependency. Refer to the build config templates:
*   **Gradle**: [gradle-config.gradle.kts](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/gradle-config.gradle.kts)
*   **Maven**: [maven-config.xml](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/maven-config.xml)

## Setup & Usage

```java
import org.archest.core.*;
import org.archest.junit6.ArchestAssertions;
import org.junit.jupiter.api.Test;

public class MyArchitectureTest {
    @Test
    public void testRules() {
        ArchestProject project = ArchestProject.parse(files);
        
        FileLocator domain = project.getFiles(new FileQueryOptions().inFolder("domain"));
        ArchestAssertions.assertThat(domain).notToDependOnFilesInFolder("infrastructure");
    }
}
```

See a full template example in [Junit6ArchitectureTest.java](file:///Users/jonathan/projects/vitest-arch/skills/archest/examples/Junit6ArchitectureTest.java).

## API & Matchers Reference

### Query Options
*   `project.getFiles(new FileQueryOptions().inFolder(folder).matchNamePattern(pattern))`
*   `project.getClasses(new ClassQueryOptions().inFolder(folder)...)`
*   `project.getFunctions(new FunctionQueryOptions().inFolder(folder)...)`
*   `project.getProperties(new PropertyQueryOptions().inFolder(folder)...)`

### Available Assertions
*   `ArchestAssertions.assertThat(files).toBeFreeOfCycles()`
*   `ArchestAssertions.assertThat(files).toDependOnFilesInFolder(folder)`
*   `ArchestAssertions.assertThat(files).toDependOnExternalModule(module)`
*   `ArchestAssertions.assertThat(classes).toResideInFolder(folder)`
*   `ArchestAssertions.assertThat(classes).toExtendClass(className)`
*   `ArchestAssertions.assertThat(classes).toImplementInterface(interfaceName)`
*   `ArchestAssertions.assertThat(properties).toBeReadonly()`

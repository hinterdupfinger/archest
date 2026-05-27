package org.archest.junit6;

import org.archest.core.*;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class ArchestJunitTest {

    @Test
    public void testProgrammaticAssertions() {
        List<String> files = new ArrayList<>();
        locateSourceFiles(new File(System.getProperty("user.dir")), files);
        
        ArchestProject project = ArchestProject.parse(files);
        assertNotNull(project);
        
        // This rule should pass: UserRepository does not depend on UserController
        ArchestAssertions.assertThat(project).check(
            ArchestRules.classes().matching(".*Repository").shouldNotDependOn(".*Controller")
        );
        
        // This rule should fail because UserController depends on UserRepository:
        assertThrows(AssertionError.class, () -> {
            ArchestAssertions.assertThat(project).check(
                ArchestRules.classes().matching(".*Controller").shouldNotDependOn(".*Repository")
            );
        });
 
        // This rule should fail because UserService and HelperService have a cycle:
        assertThrows(AssertionError.class, () -> {
            ArchestAssertions.assertThat(project).check(
                ArchestRules.files().matching(".*").shouldBeFreeOfCycles()
            );
        });
    }

    @Test
    public void testFunctionalAssertions() {
        List<String> files = new ArrayList<>();
        // Scan from parent directory to get all packages/sources
        File baseDir = new File(System.getProperty("user.dir"));
        File scanDir = baseDir.getName().equals("archest-junit6") ? baseDir.getParentFile() : baseDir;
        locateSourceFiles(scanDir, files);

        ArchestProject project = ArchestProject.parse(files);
        assertNotNull(project);

        // 1. FileLocator assertions
        FileLocator mainFiles = project.getFiles(new FileQueryOptions().matchNamePattern("src/main/"));
        assertNotNull(mainFiles);
        ArchestAssertions.assertThat(mainFiles).notToDependOnFilesInFolder("test");

        FileLocator repoFiles = project.getFiles(new FileQueryOptions().inFolder("repositories"));
        ArchestAssertions.assertThat(repoFiles).toHaveMaxExportedFunctions(10);

        // 2. ClassLocator assertions
        ClassLocator classLocator = project.getClasses();
        assertNotNull(classLocator);
        ArchestAssertions.assertThat(classLocator).toHaveNameMatchingFileName();

        ClassLocator repoClasses = project.getClasses(new ClassQueryOptions().matchNamePattern(".*Repository"));
        ArchestAssertions.assertThat(repoClasses).notToHaveModifier("abstract");

        // 3. FunctionLocator assertions
        FunctionLocator functionLocator = project.getFunctions(new FunctionQueryOptions().matchNamePattern("^locate.*"));
        assertNotNull(functionLocator);
        ArchestAssertions.assertThat(functionLocator).toHaveExplicitReturnType();

        // 4. PropertyLocator assertions
        PropertyLocator propertyLocator = project.getProperties();
        assertNotNull(propertyLocator);

        // 5. SliceLocator assertions
        SliceLocator sliceLocator = project.getSlices("jvm/(.*)");
        assertNotNull(sliceLocator);

        // 6. LayeredArchitecture assertions
        LayeredArchitecture layered = project.layeredArchitecture()
            .layer("Repositories", "repositories")
            .layer("Services", "services")
            .layer("Controllers", "controllers");

        layered.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services", "Controllers");
        layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers");

        ArchestAssertions.assertThat(layered).toPass();
    }

    private void locateSourceFiles(File dir, List<String> files) {
        File[] list = dir.listFiles();
        if (list == null) return;
        for (File file : list) {
            if (file.isDirectory()) {
                String name = file.getName();
                if (!name.equals("target") && !name.equals("build") && !name.equals("node_modules") && !name.equals(".git") && !name.equals(".turbo") && !name.equals("out")) {
                    locateSourceFiles(file, files);
                }
            } else {
                String name = file.getName();
                if (name.endsWith(".java") || name.endsWith(".kt")) {
                    files.add(file.getAbsolutePath());
                }
            }
        }
    }
}

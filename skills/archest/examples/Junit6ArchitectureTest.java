package org.archest.examples;

import org.archest.core.*;
import org.archest.junit6.*;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class Junit6ArchitectureTest {

    @Test
    public void testArchitecture() {
        List<String> files = new ArrayList<>();
        // Scan the project directory
        locateSourceFiles(new File("src/main/java"), files);
        ArchestProject project = ArchestProject.parse(files);

        // 1. Files in domain should not depend on infrastructure (with counter-checks)
        FileLocator domain = project.getFiles(new FileQueryOptions().inFolder("domain"));
        FileLocator infra = project.getFiles(new FileQueryOptions().inFolder("infrastructure"));
        org.junit.jupiter.api.Assertions.assertFalse(domain.getFiles().isEmpty(), "Domain folder must contain files");
        org.junit.jupiter.api.Assertions.assertFalse(infra.getFiles().isEmpty(), "Infrastructure folder must contain files");
        ArchestAssertions.assertThat(domain).notToDependOnFilesInFolder("infrastructure");

        // 2. Class naming rules (with counter-check)
        ClassLocator services = project.getClasses(new ClassQueryOptions().inFolder("services"));
        org.junit.jupiter.api.Assertions.assertFalse(services.getClasses().isEmpty(), "Services folder must contain classes");
        ArchestAssertions.assertThat(services).toMatchNamePattern(".*Service$");

        // 3. Layered architecture definition
        LayeredArchitecture layered = project.layeredArchitecture()
            .layer("Domain", "domain")
            .layer("Services", "services")
            .layer("Controllers", "controllers");

        layered.whereLayer("Domain").shouldNotAccessAnyLayer();
        layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers");

        ArchestAssertions.assertThat(layered).toPass();
    }

    private void locateSourceFiles(File dir, List<String> result) {
        File[] list = dir.listFiles();
        if (list == null) return;
        for (File f : list) {
            if (f.isDirectory()) {
                locateSourceFiles(f, result);
            } else if (f.getName().endsWith(".java")) {
                result.add(f.getAbsolutePath());
            }
        }
    }
}

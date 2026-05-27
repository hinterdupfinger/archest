package org.archest.junit6;

import org.archest.core.ArchestProject;
import org.archest.core.JvmRuleResult;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

public class ArchestExtension implements BeforeAllCallback {

    @Override
    public void beforeAll(ExtensionContext context) throws Exception {
        Class<?> testClass = context.getRequiredTestClass();
        AnalyzeClasses analyzeClasses = testClass.getAnnotation(AnalyzeClasses.class);
        if (analyzeClasses == null) {
            return;
        }

        // 1. Locate all Java and Kotlin files in the project
        List<String> files = new ArrayList<>();
        locateSourceFiles(new File(System.getProperty("user.dir")), files);

        if (files.isEmpty()) {
            throw new IllegalStateException("Archest could not locate any Java/Kotlin files in the directory: " + System.getProperty("user.dir"));
        }

        // 2. Parse the project once
        ArchestProject project = ArchestProject.parse(files);

        // 3. Run each @ArchTest field
        List<String> failures = new ArrayList<>();
        for (Field field : testClass.getDeclaredFields()) {
            if (field.isAnnotationPresent(ArchTest.class)) {
                if (!Modifier.isStatic(field.getModifiers())) {
                    throw new IllegalStateException("Field " + field.getName() + " annotated with @ArchTest must be static.");
                }
                if (!ArchestRule.class.isAssignableFrom(field.getType())) {
                    throw new IllegalStateException("Field " + field.getName() + " annotated with @ArchTest must be of type ArchestRule.");
                }

                field.setAccessible(true);
                ArchestRule rule = (ArchestRule) field.get(null);
                if (rule == null) {
                    throw new IllegalStateException("Field " + field.getName() + " is null.");
                }
                
                JvmRuleResult result = rule.check(project);
                if (!result.pass()) {
                    failures.add("Rule '" + field.getName() + "' failed:\n" + result.message());
                }
            }
        }

        if (!failures.isEmpty()) {
            throw new AssertionError("Archest Architectural Validation Failed:\n" + String.join("\n\n", failures));
        }
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

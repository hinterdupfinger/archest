package org.archest.junit6;

import org.archest.core.ArchestProject;
import org.archest.core.JvmRuleResult;
import org.archest.core.ProjectData;
import org.jspecify.annotations.NonNull;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class ArchestRules {

    public static class FileRulesBuilder {
        private String pattern = ".*";

        public FileRulesBuilder matching(String pattern) {
            this.pattern = pattern;
            return this;
        }

        public ArchestRule shouldBeFreeOfCycles() {
            return project -> {
                List<String> targetFiles = project.getProjectData().files().stream()
                    .map(ProjectData.FileData::path)
                    .filter(path -> path.matches(pattern))
                    .collect(Collectors.toList());
                return project.checkFileCycles(targetFiles, false);
            };
        }
    }

    public static class ClassRulesBuilder {
        private String pattern = ".*";

        public ClassRulesBuilder matching(String pattern) {
            this.pattern = pattern;
            return this;
        }

        public ArchestRule shouldNotDependOn(String targetPattern) {
            return project -> {
                List<String> violations = new ArrayList<>();
                ProjectData data = project.getProjectData();
                List<String> targetFiles = data.files().stream()
                    .filter(f -> f.classes().stream().anyMatch(c -> c.name() != null && c.name().matches(targetPattern)))
                    .map(ProjectData.FileData::path)
                    .collect(Collectors.toList());

                for (ProjectData.FileData file : data.files()) {
                    boolean hasMatchingClass = file.classes().stream()
                        .anyMatch(c -> c.name() != null && c.name().matches(pattern));
                    
                    if (hasMatchingClass) {
                        for (String dep : file.dependencies()) {
                            if (targetFiles.contains(dep)) {
                                violations.add("File " + file.path() + " contains class matching pattern '" + pattern + 
                                               "' but depends on " + dep + " which contains class matching '" + targetPattern + "'");
                            }
                        }
                    }
                }

                boolean pass = violations.isEmpty();
                String message = pass ? "No dependency violations found." : String.join("\n", violations);
                return new JvmRuleResult(pass, message);
            };
        }
    }

    public static FileRulesBuilder files() {
        return new FileRulesBuilder();
    }

    public static ClassRulesBuilder classes() {
        return new ClassRulesBuilder();
    }
}

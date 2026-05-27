package org.archest.core;

import java.util.*;
import java.util.function.Function;

public class LayeredArchitecture {
    private final List<ProjectData.FileData> files;
    private final ProjectData projectData;
    private final Map<String, String> layers = new LinkedHashMap<>();
    private final List<Function<List<ProjectData.FileData>, List<String>>> assertions = new ArrayList<>();

    public LayeredArchitecture(List<ProjectData.FileData> files, ProjectData projectData) {
        this.files = files;
        this.projectData = projectData;
    }

    public LayeredArchitecture layer(String name, String folderPattern) {
        layers.put(name, folderPattern);
        return this;
    }

    public WhereLayerBuilder whereLayer(String name) {
        if (!layers.containsKey(name)) {
            throw new IllegalArgumentException("Layer " + name + " is not defined");
        }
        return new WhereLayerBuilder(name);
    }

    public JvmRuleResult check() {
        List<String> violations = new ArrayList<>();
        for (var assertion : assertions) {
            violations.addAll(assertion.apply(files));
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public Map<String, String> getLayers() {
        return layers;
    }

    public List<ProjectData.FileData> getFiles() {
        return files;
    }

    public class WhereLayerBuilder {
        private final String targetLayer;

        public WhereLayerBuilder(String targetLayer) {
            this.targetLayer = targetLayer;
        }

        public LayeredArchitecture shouldNotBeAccessedByAnyLayer() {
            String targetPattern = layers.get(targetLayer);
            assertions.add(filesList -> {
                List<String> violations = new ArrayList<>();
                for (var file : filesList) {
                    String path = file.path();
                    if (!path.contains("/" + targetPattern + "/") && !path.contains("\\" + targetPattern + "\\")) {
                        boolean importsTarget = file.dependencies().stream().anyMatch(dep ->
                            dep.contains("/" + targetPattern + "/") || dep.contains("\\" + targetPattern + "\\")
                        );
                        if (importsTarget) {
                            violations.add("File " + path + " accesses layer " + targetLayer + " but it shouldn't.");
                        }
                    }
                }
                return violations;
            });
            return LayeredArchitecture.this;
        }

        public LayeredArchitecture shouldOnlyBeAccessedBy(String... allowedLayers) {
            String targetPattern = layers.get(targetLayer);
            List<String> allowedPatterns = Arrays.stream(allowedLayers)
                .map(layers::get)
                .toList();

            assertions.add(filesList -> {
                List<String> violations = new ArrayList<>();
                for (var file : filesList) {
                    String path = file.path();
                    boolean isInAllowedLayer = allowedPatterns.stream().anyMatch(p ->
                        p != null && (path.contains("/" + p + "/") || path.contains("\\" + p + "\\"))
                    );
                    if (!path.contains("/" + targetPattern + "/") && !path.contains("\\" + targetPattern + "\\") && !isInAllowedLayer) {
                        boolean importsTarget = file.dependencies().stream().anyMatch(dep ->
                            dep.contains("/" + targetPattern + "/") || dep.contains("\\" + targetPattern + "\\")
                        );
                        if (importsTarget) {
                            violations.add("File " + path + " accesses layer " + targetLayer + " but only " + String.join(", ", allowedLayers) + " are allowed.");
                        }
                    }
                }
                return violations;
            });
            return LayeredArchitecture.this;
        }
    }
}

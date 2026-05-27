package org.archest.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.kotlin.KotlinModule;
import org.jspecify.annotations.NonNull;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class ArchestProject {
    static {
        NativeLoader.load();
    }

    private final uniffi.archest_jvm.ArchestProject nativeProject;
    private final ProjectData projectData;

    private ArchestProject(uniffi.archest_jvm.ArchestProject nativeProject, ProjectData projectData) {
        this.nativeProject = nativeProject;
        this.projectData = projectData;
    }

    @NonNull
    public static ArchestProject parse(@NonNull List<String> files) {
        uniffi.archest_jvm.ArchestProject nativeProject = uniffi.archest_jvm.ArchestProject.Companion.parse(files);
        String json = nativeProject.getProjectDataJson();
        try {
            ObjectMapper mapper = new ObjectMapper()
                .registerModule(new KotlinModule.Builder().build())
                .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            ProjectData projectData = mapper.readValue(json, ProjectData.class);
            return new ArchestProject(nativeProject, projectData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse project data AST JSON", e);
        }
    }

    @NonNull
    public ProjectData getProjectData() {
        return projectData;
    }

    public uniffi.archest_jvm.@NonNull ArchestProject getNativeProject() {
        return nativeProject;
    }

    @NonNull
    public JvmRuleResult checkFileCycles(@NonNull List<String> locatorFiles, boolean isNot) {
        uniffi.archest_jvm.JvmRuleResult res = nativeProject.checkFileCycles(locatorFiles, isNot);
        return new JvmRuleResult(res.getPass(), res.getMessage());
    }

    public FileLocator getFiles() {
        return getFiles(new FileQueryOptions());
    }

    private List<ClassLocatorItem> filterClasses(List<ClassLocatorItem> items, ClassQueryOptions options) {
        if (options == null) return items;
        List<ClassLocatorItem> all = items;
        if (options.getInFolder() != null) {
            String folder = options.getInFolder();
            all = all.stream()
                .filter(c -> c.filePath().contains("/" + folder + "/") || c.filePath().contains("\\" + folder + "\\"))
                .collect(Collectors.toList());
        }
        if (options.getMatchNamePattern() != null) {
            Pattern p = options.getMatchNamePattern();
            all = all.stream()
                .filter(c -> c.classData().name() != null && p.matcher(c.classData().name()).find())
                .collect(Collectors.toList());
        }
        if (options.getWithDecorator() != null) {
            String decorator = options.getWithDecorator();
            all = all.stream()
                .filter(c -> c.classData().decorators().contains(decorator))
                .collect(Collectors.toList());
        }
        if (options.getExtending() != null) {
            String extending = options.getExtending();
            all = all.stream()
                .filter(c -> extending.equals(c.classData().extendsClass()))
                .collect(Collectors.toList());
        }
        if (options.getImplementing() != null) {
            String implementing = options.getImplementing();
            all = all.stream()
                .filter(c -> c.classData().implementsInterfaces().contains(implementing))
                .collect(Collectors.toList());
        }
        if (options.getHavingModifier() != null) {
            String modifier = options.getHavingModifier();
            all = all.stream()
                .filter(c -> {
                    switch (modifier) {
                        case "export": return c.classData().isExported();
                        case "default": return c.classData().isDefault();
                        case "abstract": return c.classData().isAbstract();
                        default: throw new IllegalArgumentException("Modifier " + modifier + " is not fully supported.");
                    }
                })
                .collect(Collectors.toList());
        }
        return all;
    }

    private List<FunctionLocatorItem> filterFunctions(List<FunctionLocatorItem> items, FunctionQueryOptions options) {
        if (options == null) return items;
        List<FunctionLocatorItem> all = items;
        if (options.getInFolder() != null) {
            String folder = options.getInFolder();
            all = all.stream()
                .filter(f -> f.filePath().contains("/" + folder + "/") || f.filePath().contains("\\" + folder + "\\"))
                .collect(Collectors.toList());
        }
        if (options.getMatchNamePattern() != null) {
            Pattern p = options.getMatchNamePattern();
            all = all.stream()
                .filter(f -> f.functionData().name() != null && p.matcher(f.functionData().name()).find())
                .collect(Collectors.toList());
        }
        if (options.getIsTopLevel() != null) {
            boolean isTopLevel = options.getIsTopLevel();
            all = all.stream()
                .filter(f -> f.functionData().isTopLevel() == isTopLevel)
                .collect(Collectors.toList());
        }
        return all;
    }

    public FileLocator getFiles(FileQueryOptions options) {
        List<ProjectData.FileData> filtered = projectData.files();
        if (options != null) {
            if (options.getInFolder() != null) {
                String folder = options.getInFolder();
                filtered = filtered.stream()
                    .filter(f -> f.path().contains("/" + folder + "/") || f.path().contains("\\" + folder + "\\"))
                    .collect(Collectors.toList());
            }
            if (options.getMatchNamePattern() != null) {
                Pattern p = options.getMatchNamePattern();
                filtered = filtered.stream()
                    .filter(f -> p.matcher(f.path()).find())
                    .collect(Collectors.toList());
            }
            if (options.getHasClass() != null) {
                ClassQueryOptions clOpt = options.getHasClass();
                filtered = filtered.stream()
                    .filter(f -> {
                        List<ClassLocatorItem> items = f.classes().stream()
                            .map(c -> new ClassLocatorItem(c, f.path()))
                            .collect(Collectors.toList());
                        return !filterClasses(items, clOpt).isEmpty();
                    })
                    .collect(Collectors.toList());
            }
            if (options.getHasFunction() != null) {
                FunctionQueryOptions fnOpt = options.getHasFunction();
                filtered = filtered.stream()
                    .filter(f -> {
                        List<FunctionLocatorItem> items = f.functions().stream()
                            .map(fn -> new FunctionLocatorItem(fn, f.path()))
                            .collect(Collectors.toList());
                        return !filterFunctions(items, fnOpt).isEmpty();
                    })
                    .collect(Collectors.toList());
            }
        }
        return new FileLocator(filtered, projectData, this);
    }

    public ClassLocator getClasses() {
        return getClasses(new ClassQueryOptions());
    }

    public ClassLocator getClasses(ClassQueryOptions options) {
        List<ClassLocatorItem> all = new ArrayList<>();
        for (var file : projectData.files()) {
            for (var c : file.classes()) {
                all.add(new ClassLocatorItem(c, file.path()));
            }
        }
        return new ClassLocator(filterClasses(all, options), projectData);
    }

    public FunctionLocator getFunctions() {
        return getFunctions(new FunctionQueryOptions());
    }

    public FunctionLocator getFunctions(FunctionQueryOptions options) {
        List<FunctionLocatorItem> all = new ArrayList<>();
        for (var file : projectData.files()) {
            for (var f : file.functions()) {
                all.add(new FunctionLocatorItem(f, file.path()));
            }
        }
        return new FunctionLocator(filterFunctions(all, options), projectData);
    }

    public PropertyLocator getProperties() {
        return getProperties(new PropertyQueryOptions());
    }

    public PropertyLocator getProperties(PropertyQueryOptions options) {
        List<PropertyLocatorItem> all = new ArrayList<>();
        for (var file : projectData.files()) {
            for (var p : file.properties()) {
                all.add(new PropertyLocatorItem(p, file.path()));
            }
        }
        if (options != null) {
            if (options.getInFolder() != null) {
                String folder = options.getInFolder();
                all = all.stream()
                    .filter(p -> p.filePath().contains("/" + folder + "/") || p.filePath().contains("\\" + folder + "\\"))
                    .collect(Collectors.toList());
            }
            if (options.getMatchNamePattern() != null) {
                Pattern p = options.getMatchNamePattern();
                all = all.stream()
                    .filter(item -> item.propertyData().name() != null && p.matcher(item.propertyData().name()).find())
                    .collect(Collectors.toList());
            }
        }
        return new PropertyLocator(all, projectData);
    }

    private String escapeRegex(String pattern) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < pattern.length(); i++) {
            char c = pattern.charAt(i);
            if (".+?^${}()|[]\\".indexOf(c) != -1) {
                sb.append('\\');
            }
            sb.append(c);
        }
        return sb.toString();
    }

    public SliceLocator getSlices(String pattern) {
        String escaped = escapeRegex(pattern);
        String regexStr = escaped.replace("*", "([^/\\\\]+)");
        Pattern slicePattern = Pattern.compile(regexStr);

        Set<String> sliceIds = new LinkedHashSet<>();
        Map<String, List<ProjectData.FileData>> sliceFiles = new LinkedHashMap<>();

        for (var sf : projectData.files()) {
            var matcher = slicePattern.matcher(sf.path());
            if (matcher.find()) {
                String sliceId = matcher.group(1);
                sliceIds.add(sliceId);
                sliceFiles.computeIfAbsent(sliceId, k -> new ArrayList<>()).add(sf);
            }
        }

        return new SliceLocator(slicePattern, sliceIds, sliceFiles, projectData);
    }

    public LayeredArchitecture layeredArchitecture() {
        return new LayeredArchitecture(projectData.files(), projectData);
    }
}

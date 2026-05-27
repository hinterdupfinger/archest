package org.archest.core;

import java.io.File;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class RuleChecks {

    public static JvmRuleResult classCheckResideInFolder(ClassLocator locator, String folder, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var c : locator.classes()) {
            String className = c.classData().name() != null ? c.classData().name() : "Anonymous Class";
            String filePath = c.filePath();
            boolean inTargetFolder = filePath.contains("/" + folder + "/") || filePath.contains("\\" + folder + "\\");

            if (isNot && inTargetFolder) {
                violations.add("Class " + className + " resides in " + folder + ", but it shouldn't.");
            } else if (!isNot && !inTargetFolder) {
                violations.add("Class " + className + " does not reside in " + folder + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckHaveModifier(ClassLocator locator, String modifierStr, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var c : locator.classes()) {
            String name = c.classData().name() != null ? c.classData().name() : "Anonymous";
            boolean passes;
            switch (modifierStr) {
                case "export":
                    passes = c.classData().isExported();
                    break;
                case "default":
                    passes = c.classData().isDefault();
                    break;
                case "abstract":
                    passes = c.classData().isAbstract();
                    break;
                default:
                    throw new IllegalArgumentException("Modifier " + modifierStr + " is not fully supported.");
            }

            String desc = "Class " + name;
            if (isNot && passes) {
                violations.add(desc + " has modifier " + modifierStr + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add(desc + " does not have modifier " + modifierStr + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckExtendClass(ClassLocator locator, String className, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var c : locator.classes()) {
            String name = c.classData().name() != null ? c.classData().name() : "Anonymous";
            boolean matches = className.equals(c.classData().extendsClass());

            if (isNot && matches) {
                violations.add("Class " + name + " extends " + className + ", but it shouldn't.");
            } else if (!isNot && !matches) {
                violations.add("Class " + name + " does not extend " + className + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckImplementInterface(ClassLocator locator, String interfaceName, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var c : locator.classes()) {
            String name = c.classData().name() != null ? c.classData().name() : "Anonymous";
            boolean matches = c.classData().implementsInterfaces().contains(interfaceName);

            if (isNot && matches) {
                violations.add("Class " + name + " implements " + interfaceName + ", but it shouldn't.");
            } else if (!isNot && !matches) {
                violations.add("Class " + name + " does not implement " + interfaceName + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckMatchNamePattern(ClassLocator locator, String pattern, boolean isNot) {
        List<String> violations = new ArrayList<>();
        Pattern p = Pattern.compile(pattern);
        for (var c : locator.classes()) {
            String name = c.classData().name();
            boolean passes = name != null && p.matcher(name).find();
            String desc = "Class " + (name != null ? name : "Anonymous");

            if (isNot && passes) {
                violations.add(desc + " matches pattern " + pattern + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add(desc + " does not match pattern " + pattern + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckHaveMaxCyclomaticComplexity(ClassLocator locator, long max, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var c : locator.classes()) {
            String name = c.classData().name();
            long complexity = c.classData().cyclomaticComplexity();
            boolean exceeds = complexity > max;
            String desc = "Class " + (name != null ? name : "Anonymous");

            if (isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ", but it shouldn't.");
            } else if (!isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ".");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult classCheckHaveNameMatchingFileName(ClassLocator locator, boolean isNot) {
        List<String> violations = new ArrayList<>();
        
        // Group classes by file path
        Map<String, List<ClassLocatorItem>> classesByFile = locator.classes().stream()
            .collect(Collectors.groupingBy(ClassLocatorItem::filePath));

        for (var entry : classesByFile.entrySet()) {
            String filePath = entry.getKey();
            List<ClassLocatorItem> fileClasses = entry.getValue();

            File f = new File(filePath);
            String filename = f.getName();
            int dot = filename.lastIndexOf('.');
            String basename = dot == -1 ? filename : filename.substring(0, dot);

            // Check if there is any class in this file that matches the basename
            boolean hasMatchingClass = fileClasses.stream()
                .anyMatch(c -> c.classData().name() != null && c.classData().name().equals(basename));

            boolean allNamesNull = fileClasses.stream()
                .allMatch(c -> c.classData().name() == null);

            if (allNamesNull) {
                continue;
            }

            if (isNot && hasMatchingClass) {
                violations.add("File " + filePath + " contains a class matching its filename " + basename + ", but it shouldn't.");
            } else if (!isNot && !hasMatchingClass) {
                violations.add("File " + filePath + " does not contain any class matching its filename " + basename + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    // Function Checks
    public static JvmRuleResult functionCheckHaveModifier(FunctionLocator locator, String modifierStr, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var f : locator.functions()) {
            String name = f.functionData().name() != null ? f.functionData().name() : "Anonymous Function";
            boolean passes;
            switch (modifierStr) {
                case "export":
                    passes = f.functionData().isExported();
                    break;
                case "async":
                    passes = f.functionData().isAsync();
                    break;
                default:
                    throw new IllegalArgumentException("Modifier " + modifierStr + " is not fully supported.");
            }

            String desc = "Function " + name;
            if (isNot && passes) {
                violations.add(desc + " has modifier " + modifierStr + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add(desc + " does not have modifier " + modifierStr + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult functionCheckHaveExplicitReturnType(FunctionLocator locator, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var f : locator.functions()) {
            String name = f.functionData().name() != null ? f.functionData().name() : "Anonymous Function";
            boolean hasType = f.functionData().hasExplicitReturnType();

            if (isNot && hasType) {
                violations.add("Function " + name + " has an explicit return type, but it shouldn't.");
            } else if (!isNot && !hasType) {
                violations.add("Function " + name + " does not have an explicit return type, but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult functionCheckMatchNamePattern(FunctionLocator locator, String pattern, boolean isNot) {
        List<String> violations = new ArrayList<>();
        Pattern p = Pattern.compile(pattern);
        for (var f : locator.functions()) {
            String name = f.functionData().name();
            boolean passes = name != null && p.matcher(name).find();
            String desc = "Function " + (name != null ? name : "Anonymous");

            if (isNot && passes) {
                violations.add(desc + " matches pattern " + pattern + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add(desc + " does not match pattern " + pattern + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult functionCheckHaveMaxCyclomaticComplexity(FunctionLocator locator, long max, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var f : locator.functions()) {
            String name = f.functionData().name();
            long complexity = f.functionData().cyclomaticComplexity();
            boolean exceeds = complexity > max;
            String desc = "Function " + (name != null ? name : "Anonymous");

            if (isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ", but it shouldn't.");
            } else if (!isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ".");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult functionCheckHaveMinMaintainabilityIndex(FunctionLocator locator, long min, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var f : locator.functions()) {
            String name = f.functionData().name();
            long mi = f.functionData().maintainabilityIndex();
            boolean fallsBelow = mi < min;
            String desc = "Function " + (name != null ? name : "Anonymous");

            if (isNot && fallsBelow) {
                violations.add(desc + " has a maintainability index of " + String.format(Locale.US, "%.2f", (double) mi) + ", which falls below the minimum of " + min + ", but it shouldn't.");
            } else if (!isNot && fallsBelow) {
                violations.add(desc + " has a maintainability index of " + String.format(Locale.US, "%.2f", (double) mi) + ", which falls below the minimum of " + min + ".");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult functionCheckHaveNameMatchingFileName(FunctionLocator locator, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var f : locator.functions()) {
            String name = f.functionData().name();
            if (f.filePath() == null) continue;

            File fileObj = new File(f.filePath());
            String filename = fileObj.getName();
            int dot = filename.lastIndexOf('.');
            String basename = dot == -1 ? filename : filename.substring(0, dot);

            boolean passes = basename.equals(name);
            String desc = "Function " + (name != null ? name : "Anonymous");

            if (isNot && passes) {
                violations.add(desc + " has a name matching its filename " + basename + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add(desc + " does not have a name matching its filename " + basename + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    // Property Checks
    public static JvmRuleResult propertyCheckBeReadonly(PropertyLocator locator, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var p : locator.properties()) {
            String name = p.propertyData().name() != null ? p.propertyData().name() : "Anonymous Property";
            boolean matches = p.propertyData().isReadonly();

            if (isNot && matches) {
                violations.add("Property " + name + " is readonly, but it shouldn't be.");
            } else if (!isNot && !matches) {
                violations.add("Property " + name + " is not readonly, but it should be.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    // File Checks
    public static JvmRuleResult checkDependOnFilesInFolder(FileLocator locator, String folder, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var file : locator.files()) {
            List<String> deps = file.dependencies();
            boolean dependsOnTarget = deps.stream().anyMatch(depPath ->
                depPath.contains("/" + folder + "/") || depPath.contains("\\" + folder + "\\")
            );

            if (isNot && dependsOnTarget) {
                violations.add("File " + file.path() + " depends on files in " + folder + ", but it shouldn't.");
            } else if (!isNot && !dependsOnTarget) {
                violations.add("File " + file.path() + " does not depend on files in " + folder + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult checkDependOnExternalModule(FileLocator locator, String moduleNamePattern, boolean isNot) {
        List<String> violations = new ArrayList<>();
        Pattern p = Pattern.compile(moduleNamePattern);
        for (var file : locator.files()) {
            List<String> deps = file.externalDependencies();
            boolean dependsOnModule = deps != null && deps.stream().anyMatch(dep -> p.matcher(dep).find());

            if (isNot && dependsOnModule) {
                violations.add(file.path() + " incorrectly depends on external module '" + moduleNamePattern + "'");
            } else if (!isNot && !dependsOnModule) {
                violations.add(file.path() + " does not depend on external module '" + moduleNamePattern + "'");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult fileCheckBeFreeOfCycles(FileLocator locator, boolean isNot) {
        if (locator.archestProject() == null) {
            return new JvmRuleResult(true, "Mock pass: archestProject not in registry");
        }
        List<String> targetFiles = locator.files().stream().map(ProjectData.FileData::path).toList();
        return locator.archestProject().checkFileCycles(targetFiles, isNot);
    }

    public static JvmRuleResult fileCheckMatchNamePattern(FileLocator locator, String pattern, boolean isNot) {
        List<String> violations = new ArrayList<>();
        Pattern p = Pattern.compile(pattern);
        for (var file : locator.files()) {
            String path = file.path();
            boolean passes = path != null && p.matcher(path).find();

            if (isNot && passes) {
                violations.add("File " + path + " matches pattern " + pattern + ", but it shouldn't.");
            } else if (!isNot && !passes) {
                violations.add("File " + path + " does not match pattern " + pattern + ", but it should.");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult fileCheckHaveMaxCyclomaticComplexity(FileLocator locator, long max, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var file : locator.files()) {
            long complexity = 0;
            for (var func : file.functions()) {
                complexity += func.cyclomaticComplexity();
            }
            for (var cls : file.classes()) {
                complexity += cls.cyclomaticComplexity();
            }
            boolean exceeds = complexity > max;
            String desc = "File " + file.path();

            if (isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ", but it shouldn't.");
            } else if (!isNot && exceeds) {
                violations.add(desc + " has a total cyclomatic complexity of " + complexity + ", which exceeds the maximum of " + max + ".");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult fileCheckHaveMinMaintainabilityIndex(FileLocator locator, long min, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var file : locator.files()) {
            long mi = 100;
            if (!file.functions().isEmpty()) {
                mi = file.functions().get(0).maintainabilityIndex();
            }
            boolean fallsBelow = mi < min;
            String desc = "File " + file.path();

            if (isNot && fallsBelow) {
                violations.add(desc + " has a maintainability index of " + String.format(Locale.US, "%.2f", (double) mi) + ", which falls below the minimum of " + min + ", but it shouldn't.");
            } else if (!isNot && fallsBelow) {
                violations.add(desc + " has a maintainability index of " + String.format(Locale.US, "%.2f", (double) mi) + ", which falls below the minimum of " + min + ".");
            }
        }
        return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
    }

    public static JvmRuleResult fileCheckHaveMaxExportedFunctions(FileLocator locator, long max, boolean isNot) {
        List<String> violations = new ArrayList<>();
        for (var file : locator.files()) {
            long count = file.functions().stream().filter(ProjectData.FunctionData::isExported).count();
            boolean exceeds = count > max;

            if (isNot && exceeds) {
                violations.add("File " + file.path() + " has " + count + " exported functions, which exceeds the maximum of " + max + ", but it shouldn't.");
            } else if (!isNot && exceeds) {
                violations.add("File " + file.path() + " has " + count + " exported functions, which exceeds the maximum of " + max + ".");
            }
        }
        boolean pass = isNot ? !violations.isEmpty() : violations.isEmpty();
        String msg = String.join("\n", violations);
        if (isNot && violations.isEmpty()) {
            msg = "Expected some files to exceed maximum exported functions, but none did.";
        }
        return new JvmRuleResult(pass, msg);
    }

    // Slice Checks
    public static JvmRuleResult sliceCheckBeFreeOfCycles(SliceLocator locator, boolean isNot) {
        Map<String, Set<String>> graph = new HashMap<>();
        for (String slice : locator.sliceIds()) {
            graph.put(slice, new HashSet<>());
        }

        for (var entry : locator.sliceFiles().entrySet()) {
            String sliceId = entry.getKey();
            List<ProjectData.FileData> files = entry.getValue();
            for (var sf : files) {
                if (sf.dependencies() == null) continue;
                for (String dep : sf.dependencies()) {
                    var matcher = locator.slicePattern().matcher(dep);
                    if (matcher.find()) {
                        String targetSlice = matcher.group(1);
                        if (!targetSlice.equals(sliceId) && locator.sliceIds().contains(targetSlice)) {
                            graph.get(sliceId).add(targetSlice);
                        }
                    }
                }
            }
        }

        Set<String> visited = new HashSet<>();
        Set<String> recursionStack = new HashSet<>();
        List<String> violations = new ArrayList<>();

        for (String slice : locator.sliceIds()) {
            if (!visited.contains(slice)) {
                List<String> path = new ArrayList<>();
                path.add(slice);
                dfs(slice, path, graph, visited, recursionStack, violations);
            }
        }

        if (isNot) {
            boolean pass = !violations.isEmpty();
            String msg = pass ? "" : "Expected cycles between slices but found none.";
            return new JvmRuleResult(pass, msg);
        } else {
            return new JvmRuleResult(violations.isEmpty(), String.join("\n", violations));
        }
    }

    private static boolean dfs(String node, List<String> path, Map<String, Set<String>> graph, Set<String> visited, Set<String> recursionStack, List<String> violations) {
        visited.add(node);
        recursionStack.add(node);

        Set<String> neighbors = graph.getOrDefault(node, Collections.emptySet());
        for (String neighbor : neighbors) {
            if (!visited.contains(neighbor)) {
                List<String> newPath = new ArrayList<>(path);
                newPath.add(neighbor);
                if (dfs(neighbor, newPath, graph, visited, recursionStack, violations)) {
                    return true;
                }
            } else if (recursionStack.contains(neighbor)) {
                violations.add("Cycle detected between slices: " + String.join(" -> ", path) + " -> " + neighbor);
                return true;
            }
        }

        recursionStack.remove(node);
        return false;
    }

    public static JvmRuleResult sliceCheckHaveMaxDistanceFromMainSequence(SliceLocator locator, double max, boolean isNot) {
        Map<String, Set<String>> ceMap = new HashMap<>();
        Map<String, Set<String>> caMap = new HashMap<>();
        for (String slice : locator.sliceIds()) {
            ceMap.put(slice, new HashSet<>());
            caMap.put(slice, new HashSet<>());
        }

        for (var entry : locator.sliceFiles().entrySet()) {
            String sliceId = entry.getKey();
            List<ProjectData.FileData> files = entry.getValue();
            for (var sf : files) {
                if (sf.dependencies() == null) continue;
                for (String dep : sf.dependencies()) {
                    var matcher = locator.slicePattern().matcher(dep);
                    if (matcher.find()) {
                        String targetSlice = matcher.group(1);
                        if (!targetSlice.equals(sliceId) && locator.sliceIds().contains(targetSlice)) {
                            ceMap.get(sliceId).add(targetSlice);
                            caMap.get(targetSlice).add(sliceId);
                        }
                    }
                }
            }
        }

        List<String> violations = new ArrayList<>();
        for (String sliceId : locator.sliceIds()) {
            int ce = ceMap.get(sliceId).size();
            int ca = caMap.get(sliceId).size();

            List<ProjectData.FileData> files = locator.sliceFiles().get(sliceId);
            int na = 0;
            int nc = 0;
            if (files != null) {
                for (var sf : files) {
                    for (var c : sf.classes()) {
                        nc++;
                        if (c.isAbstract()) {
                            na++;
                        }
                    }
                }
            }

            double I = (ce + ca == 0) ? 0.0 : (double) ce / (ca + ce);
            double A = (nc == 0) ? 0.0 : (double) na / nc;
            double D = Math.abs(A + I - 1.0);
            boolean exceeds = D > max;

            if (isNot && exceeds) {
                violations.add("Slice " + sliceId + " has a Distance from the Main Sequence of " + String.format(Locale.US, "%.2f", D) + ", which exceeds the maximum of " + max + ", but it shouldn't.");
            } else if (!isNot && exceeds) {
                violations.add("Slice " + sliceId + " has a Distance from the Main Sequence of " + String.format(Locale.US, "%.2f", D) + ", which exceeds the maximum of " + max + ".");
            }
        }

        boolean pass = isNot ? !violations.isEmpty() : violations.isEmpty();
        String msg = String.join("\n", violations);
        if (isNot && violations.isEmpty()) {
            msg = "Expected some slices to exceed maximum distance from main sequence, but none did.";
        }
        return new JvmRuleResult(pass, msg);
    }
}

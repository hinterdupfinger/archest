package org.archest.junit6;

import org.archest.core.*;
import org.jspecify.annotations.NonNull;

public class ArchestAssertions {

    public static class ProjectAssertion {
        private final ArchestProject project;

        public ProjectAssertion(ArchestProject project) {
            this.project = project;
        }

        public void check(@NonNull ArchestRule rule) {
            JvmRuleResult result = rule.check(project);
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }
    }

    @NonNull
    public static ProjectAssertion assertThat(@NonNull ArchestProject project) {
        return new ProjectAssertion(project);
    }

    public static class FileLocatorAssertion {
        private final FileLocator locator;

        public FileLocatorAssertion(FileLocator locator) {
            this.locator = locator;
        }

        private void check(JvmRuleResult result) {
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }

        public FileLocatorAssertion toBeFreeOfCycles() {
            check(RuleChecks.fileCheckBeFreeOfCycles(locator, false));
            return this;
        }

        public FileLocatorAssertion notToBeFreeOfCycles() {
            check(RuleChecks.fileCheckBeFreeOfCycles(locator, true));
            return this;
        }

        public FileLocatorAssertion toDependOnFilesInFolder(String folder) {
            check(RuleChecks.checkDependOnFilesInFolder(locator, folder, false));
            return this;
        }

        public FileLocatorAssertion notToDependOnFilesInFolder(String folder) {
            check(RuleChecks.checkDependOnFilesInFolder(locator, folder, true));
            return this;
        }

        public FileLocatorAssertion toDependOnExternalModule(String pattern) {
            check(RuleChecks.checkDependOnExternalModule(locator, pattern, false));
            return this;
        }

        public FileLocatorAssertion notToDependOnExternalModule(String pattern) {
            check(RuleChecks.checkDependOnExternalModule(locator, pattern, true));
            return this;
        }

        public FileLocatorAssertion toMatchNamePattern(String pattern) {
            check(RuleChecks.fileCheckMatchNamePattern(locator, pattern, false));
            return this;
        }

        public FileLocatorAssertion notToMatchNamePattern(String pattern) {
            check(RuleChecks.fileCheckMatchNamePattern(locator, pattern, true));
            return this;
        }

        public FileLocatorAssertion toHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.fileCheckHaveMaxCyclomaticComplexity(locator, max, false));
            return this;
        }

        public FileLocatorAssertion notToHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.fileCheckHaveMaxCyclomaticComplexity(locator, max, true));
            return this;
        }

        public FileLocatorAssertion toHaveMinMaintainabilityIndex(long min) {
            check(RuleChecks.fileCheckHaveMinMaintainabilityIndex(locator, min, false));
            return this;
        }

        public FileLocatorAssertion notToHaveMinMaintainabilityIndex(long min) {
            check(RuleChecks.fileCheckHaveMinMaintainabilityIndex(locator, min, true));
            return this;
        }

        public FileLocatorAssertion toHaveMaxExportedFunctions(long max) {
            check(RuleChecks.fileCheckHaveMaxExportedFunctions(locator, max, false));
            return this;
        }

        public FileLocatorAssertion notToHaveMaxExportedFunctions(long max) {
            check(RuleChecks.fileCheckHaveMaxExportedFunctions(locator, max, true));
            return this;
        }
    }

    @NonNull
    public static FileLocatorAssertion assertThat(@NonNull FileLocator locator) {
        return new FileLocatorAssertion(locator);
    }

    public static class ClassLocatorAssertion {
        private final ClassLocator locator;

        public ClassLocatorAssertion(ClassLocator locator) {
            this.locator = locator;
        }

        private void check(JvmRuleResult result) {
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }

        public ClassLocatorAssertion toResideInFolder(String folder) {
            check(RuleChecks.classCheckResideInFolder(locator, folder, false));
            return this;
        }

        public ClassLocatorAssertion notToResideInFolder(String folder) {
            check(RuleChecks.classCheckResideInFolder(locator, folder, true));
            return this;
        }

        public ClassLocatorAssertion toHaveModifier(String modifier) {
            check(RuleChecks.classCheckHaveModifier(locator, modifier, false));
            return this;
        }

        public ClassLocatorAssertion notToHaveModifier(String modifier) {
            check(RuleChecks.classCheckHaveModifier(locator, modifier, true));
            return this;
        }

        public ClassLocatorAssertion toExtendClass(String className) {
            check(RuleChecks.classCheckExtendClass(locator, className, false));
            return this;
        }

        public ClassLocatorAssertion notToExtendClass(String className) {
            check(RuleChecks.classCheckExtendClass(locator, className, true));
            return this;
        }

        public ClassLocatorAssertion toImplementInterface(String interfaceName) {
            check(RuleChecks.classCheckImplementInterface(locator, interfaceName, false));
            return this;
        }

        public ClassLocatorAssertion notToImplementInterface(String interfaceName) {
            check(RuleChecks.classCheckImplementInterface(locator, interfaceName, true));
            return this;
        }

        public ClassLocatorAssertion toMatchNamePattern(String pattern) {
            check(RuleChecks.classCheckMatchNamePattern(locator, pattern, false));
            return this;
        }

        public ClassLocatorAssertion notToMatchNamePattern(String pattern) {
            check(RuleChecks.classCheckMatchNamePattern(locator, pattern, true));
            return this;
        }

        public ClassLocatorAssertion toHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.classCheckHaveMaxCyclomaticComplexity(locator, max, false));
            return this;
        }

        public ClassLocatorAssertion notToHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.classCheckHaveMaxCyclomaticComplexity(locator, max, true));
            return this;
        }

        public ClassLocatorAssertion toHaveNameMatchingFileName() {
            check(RuleChecks.classCheckHaveNameMatchingFileName(locator, false));
            return this;
        }

        public ClassLocatorAssertion notToHaveNameMatchingFileName() {
            check(RuleChecks.classCheckHaveNameMatchingFileName(locator, true));
            return this;
        }
    }

    @NonNull
    public static ClassLocatorAssertion assertThat(@NonNull ClassLocator locator) {
        return new ClassLocatorAssertion(locator);
    }

    public static class FunctionLocatorAssertion {
        private final FunctionLocator locator;

        public FunctionLocatorAssertion(FunctionLocator locator) {
            this.locator = locator;
        }

        private void check(JvmRuleResult result) {
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }

        public FunctionLocatorAssertion toHaveModifier(String modifier) {
            check(RuleChecks.functionCheckHaveModifier(locator, modifier, false));
            return this;
        }

        public FunctionLocatorAssertion notToHaveModifier(String modifier) {
            check(RuleChecks.functionCheckHaveModifier(locator, modifier, true));
            return this;
        }

        public FunctionLocatorAssertion toHaveExplicitReturnType() {
            check(RuleChecks.functionCheckHaveExplicitReturnType(locator, false));
            return this;
        }

        public FunctionLocatorAssertion notToHaveExplicitReturnType() {
            check(RuleChecks.functionCheckHaveExplicitReturnType(locator, true));
            return this;
        }

        public FunctionLocatorAssertion toMatchNamePattern(String pattern) {
            check(RuleChecks.functionCheckMatchNamePattern(locator, pattern, false));
            return this;
        }

        public FunctionLocatorAssertion notToMatchNamePattern(String pattern) {
            check(RuleChecks.functionCheckMatchNamePattern(locator, pattern, true));
            return this;
        }

        public FunctionLocatorAssertion toHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.functionCheckHaveMaxCyclomaticComplexity(locator, max, false));
            return this;
        }

        public FunctionLocatorAssertion notToHaveMaxCyclomaticComplexity(long max) {
            check(RuleChecks.functionCheckHaveMaxCyclomaticComplexity(locator, max, true));
            return this;
        }

        public FunctionLocatorAssertion toHaveMinMaintainabilityIndex(long min) {
            check(RuleChecks.functionCheckHaveMinMaintainabilityIndex(locator, min, false));
            return this;
        }

        public FunctionLocatorAssertion notToHaveMinMaintainabilityIndex(long min) {
            check(RuleChecks.functionCheckHaveMinMaintainabilityIndex(locator, min, true));
            return this;
        }

        public FunctionLocatorAssertion toHaveNameMatchingFileName() {
            check(RuleChecks.functionCheckHaveNameMatchingFileName(locator, false));
            return this;
        }

        public FunctionLocatorAssertion notToHaveNameMatchingFileName() {
            check(RuleChecks.functionCheckHaveNameMatchingFileName(locator, true));
            return this;
        }
    }

    @NonNull
    public static FunctionLocatorAssertion assertThat(@NonNull FunctionLocator locator) {
        return new FunctionLocatorAssertion(locator);
    }

    public static class PropertyLocatorAssertion {
        private final PropertyLocator locator;

        public PropertyLocatorAssertion(PropertyLocator locator) {
            this.locator = locator;
        }

        private void check(JvmRuleResult result) {
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }

        public PropertyLocatorAssertion toBeReadonly() {
            check(RuleChecks.propertyCheckBeReadonly(locator, false));
            return this;
        }

        public PropertyLocatorAssertion notToBeReadonly() {
            check(RuleChecks.propertyCheckBeReadonly(locator, true));
            return this;
        }
    }

    @NonNull
    public static PropertyLocatorAssertion assertThat(@NonNull PropertyLocator locator) {
        return new PropertyLocatorAssertion(locator);
    }

    public static class SliceLocatorAssertion {
        private final SliceLocator locator;

        public SliceLocatorAssertion(SliceLocator locator) {
            this.locator = locator;
        }

        private void check(JvmRuleResult result) {
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }

        public SliceLocatorAssertion toBeFreeOfCycles() {
            check(RuleChecks.sliceCheckBeFreeOfCycles(locator, false));
            return this;
        }

        public SliceLocatorAssertion notToBeFreeOfCycles() {
            check(RuleChecks.sliceCheckBeFreeOfCycles(locator, true));
            return this;
        }

        public SliceLocatorAssertion toHaveMaxDistanceFromMainSequence(double max) {
            check(RuleChecks.sliceCheckHaveMaxDistanceFromMainSequence(locator, max, false));
            return this;
        }

        public SliceLocatorAssertion notToHaveMaxDistanceFromMainSequence(double max) {
            check(RuleChecks.sliceCheckHaveMaxDistanceFromMainSequence(locator, max, true));
            return this;
        }
    }

    @NonNull
    public static SliceLocatorAssertion assertThat(@NonNull SliceLocator locator) {
        return new SliceLocatorAssertion(locator);
    }

    public static class LayeredArchitectureAssertion {
        private final LayeredArchitecture architecture;

        public LayeredArchitectureAssertion(LayeredArchitecture architecture) {
            this.architecture = architecture;
        }

        public void toPass() {
            JvmRuleResult result = architecture.check();
            if (!result.pass()) {
                throw new AssertionError(result.message());
            }
        }
    }

    @NonNull
    public static LayeredArchitectureAssertion assertThat(@NonNull LayeredArchitecture architecture) {
        return new LayeredArchitectureAssertion(architecture);
    }
}

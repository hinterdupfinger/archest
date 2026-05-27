package org.archest.kotest

import org.archest.core.*

// FileLocator Matchers
fun FileLocator.shouldBeFreeOfCycles() {
    val res = RuleChecks.fileCheckBeFreeOfCycles(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun FileLocator.shouldNotBeFreeOfCycles() {
    val res = RuleChecks.fileCheckBeFreeOfCycles(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldDependOnFilesInFolder(folder: String) {
    val res = RuleChecks.checkDependOnFilesInFolder(this, folder, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotDependOnFilesInFolder(folder: String) {
    val res = RuleChecks.checkDependOnFilesInFolder(this, folder, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldDependOnExternalModule(pattern: String) {
    val res = RuleChecks.checkDependOnExternalModule(this, pattern, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotDependOnExternalModule(pattern: String) {
    val res = RuleChecks.checkDependOnExternalModule(this, pattern, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldMatchNamePattern(pattern: String) {
    val res = RuleChecks.fileCheckMatchNamePattern(this, pattern, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotMatchNamePattern(pattern: String) {
    val res = RuleChecks.fileCheckMatchNamePattern(this, pattern, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.fileCheckHaveMaxCyclomaticComplexity(this, max, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.fileCheckHaveMaxCyclomaticComplexity(this, max, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldHaveMinMaintainabilityIndex(min: Long) {
    val res = RuleChecks.fileCheckHaveMinMaintainabilityIndex(this, min, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotHaveMinMaintainabilityIndex(min: Long) {
    val res = RuleChecks.fileCheckHaveMinMaintainabilityIndex(this, min, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldHaveMaxExportedFunctions(max: Long) {
    val res = RuleChecks.fileCheckHaveMaxExportedFunctions(this, max, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FileLocator.shouldNotHaveMaxExportedFunctions(max: Long) {
    val res = RuleChecks.fileCheckHaveMaxExportedFunctions(this, max, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// ClassLocator Matchers
infix fun ClassLocator.shouldResideInFolder(folder: String) {
    val res = RuleChecks.classCheckResideInFolder(this, folder, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotResideInFolder(folder: String) {
    val res = RuleChecks.classCheckResideInFolder(this, folder, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldHaveModifier(modifier: String) {
    val res = RuleChecks.classCheckHaveModifier(this, modifier, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotHaveModifier(modifier: String) {
    val res = RuleChecks.classCheckHaveModifier(this, modifier, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldExtendClass(className: String) {
    val res = RuleChecks.classCheckExtendClass(this, className, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotExtendClass(className: String) {
    val res = RuleChecks.classCheckExtendClass(this, className, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldImplementInterface(interfaceName: String) {
    val res = RuleChecks.classCheckImplementInterface(this, interfaceName, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotImplementInterface(interfaceName: String) {
    val res = RuleChecks.classCheckImplementInterface(this, interfaceName, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldMatchNamePattern(pattern: String) {
    val res = RuleChecks.classCheckMatchNamePattern(this, pattern, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotMatchNamePattern(pattern: String) {
    val res = RuleChecks.classCheckMatchNamePattern(this, pattern, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.classCheckHaveMaxCyclomaticComplexity(this, max, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun ClassLocator.shouldNotHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.classCheckHaveMaxCyclomaticComplexity(this, max, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun ClassLocator.shouldHaveNameMatchingFileName() {
    val res = RuleChecks.classCheckHaveNameMatchingFileName(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun ClassLocator.shouldNotHaveNameMatchingFileName() {
    val res = RuleChecks.classCheckHaveNameMatchingFileName(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// FunctionLocator Matchers
infix fun FunctionLocator.shouldHaveModifier(modifier: String) {
    val res = RuleChecks.functionCheckHaveModifier(this, modifier, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldNotHaveModifier(modifier: String) {
    val res = RuleChecks.functionCheckHaveModifier(this, modifier, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun FunctionLocator.shouldHaveExplicitReturnType() {
    val res = RuleChecks.functionCheckHaveExplicitReturnType(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun FunctionLocator.shouldNotHaveExplicitReturnType() {
    val res = RuleChecks.functionCheckHaveExplicitReturnType(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldMatchNamePattern(pattern: String) {
    val res = RuleChecks.functionCheckMatchNamePattern(this, pattern, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldNotMatchNamePattern(pattern: String) {
    val res = RuleChecks.functionCheckMatchNamePattern(this, pattern, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.functionCheckHaveMaxCyclomaticComplexity(this, max, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldNotHaveMaxCyclomaticComplexity(max: Long) {
    val res = RuleChecks.functionCheckHaveMaxCyclomaticComplexity(this, max, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldHaveMinMaintainabilityIndex(min: Long) {
    val res = RuleChecks.functionCheckHaveMinMaintainabilityIndex(this, min, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun FunctionLocator.shouldNotHaveMinMaintainabilityIndex(min: Long) {
    val res = RuleChecks.functionCheckHaveMinMaintainabilityIndex(this, min, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun FunctionLocator.shouldHaveNameMatchingFileName() {
    val res = RuleChecks.functionCheckHaveNameMatchingFileName(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun FunctionLocator.shouldNotHaveNameMatchingFileName() {
    val res = RuleChecks.functionCheckHaveNameMatchingFileName(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// PropertyLocator Matchers
fun PropertyLocator.shouldBeReadonly() {
    val res = RuleChecks.propertyCheckBeReadonly(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun PropertyLocator.shouldNotBeReadonly() {
    val res = RuleChecks.propertyCheckBeReadonly(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// SliceLocator Matchers
fun SliceLocator.shouldBeFreeOfCycles() {
    val res = RuleChecks.sliceCheckBeFreeOfCycles(this, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

fun SliceLocator.shouldNotBeFreeOfCycles() {
    val res = RuleChecks.sliceCheckBeFreeOfCycles(this, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun SliceLocator.shouldHaveMaxDistanceFromMainSequence(max: Double) {
    val res = RuleChecks.sliceCheckHaveMaxDistanceFromMainSequence(this, max, false)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}

infix fun SliceLocator.shouldNotHaveMaxDistanceFromMainSequence(max: Double) {
    val res = RuleChecks.sliceCheckHaveMaxDistanceFromMainSequence(this, max, true)
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// LayeredArchitecture Matchers
fun LayeredArchitecture.shouldPass() {
    val res = this.check()
    if (!res.pass()) throw java.lang.AssertionError(res.message())
}


// Legacy / Backward Compatible APIs
class ClassDependenciesBuilder(val project: ArchestProject, val pattern: String) {
    infix fun shouldNotDependOn(targetPattern: String) {
        val violations = mutableListOf<String>()
        val data = project.projectData
        val targetFiles = data.files.filter { file ->
            file.classes.any { it.name?.matches(Regex(targetPattern)) == true }
        }.map { it.path }

        for (file in data.files) {
            val hasMatchingClass = file.classes.any { it.name?.matches(Regex(pattern)) == true }
            if (hasMatchingClass) {
                for (dep in file.dependencies) {
                    if (dep in targetFiles) {
                        violations.add("File ${file.path} contains class matching '$pattern' but depends on $dep which contains class matching '$targetPattern'")
                    }
                }
            }
        }

        if (violations.isNotEmpty()) {
            throw java.lang.AssertionError("Architecture validation failed:\n" + violations.joinToString("\n"))
        }
    }
}

fun ArchestProject.classes(pattern: String): ClassDependenciesBuilder {
    return ClassDependenciesBuilder(this, pattern)
}

fun ArchestProject.files(pattern: String = ".*"): FileCycleBuilder {
    return FileCycleBuilder(this, pattern)
}

class FileCycleBuilder(val project: ArchestProject, val pattern: String) {
    fun shouldBeFreeOfCycles() {
        val targetFiles = project.projectData.files
            .map { it.path }
            .filter { it.matches(Regex(pattern)) }
        
        val res = project.checkFileCycles(targetFiles, false)
        if (!res.pass) {
            throw java.lang.AssertionError(res.message)
        }
    }
}

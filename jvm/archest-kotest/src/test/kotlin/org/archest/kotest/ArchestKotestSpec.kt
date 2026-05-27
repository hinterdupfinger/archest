package org.archest.kotest

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import org.archest.core.*
import java.io.File

class ArchestKotestSpec : StringSpec({
    "should validate class dependency rules using DSL" {
        val files = mutableListOf<String>()
        // If run from gradle subproject, user.dir is jvm/archest-kotest.
        // We want to scan the sibling archest-junit6 mock classes too, so we scan from the jvm/ parent directory.
        val baseDir = File(System.getProperty("user.dir"))
        val scanDir = if (baseDir.name == "archest-kotest") baseDir.parentFile else baseDir
        
        locateSourceFiles(scanDir, files)
        
        val project = ArchestProject.parse(files)
        
        // This rule should pass
        project.classes(".*Repository") shouldNotDependOn ".*Controller"
        
        // This rule should fail
        shouldThrow<AssertionError> {
            project.classes(".*Controller") shouldNotDependOn ".*Repository"
        }

        // This rule should fail due to cycles
        shouldThrow<AssertionError> {
            project.files(".*").shouldBeFreeOfCycles()
        }
    }

    "should validate functional rules using DSL matchers" {
        val files = mutableListOf<String>()
        val baseDir = File(System.getProperty("user.dir"))
        val scanDir = if (baseDir.name == "archest-kotest") baseDir.parentFile else baseDir
        locateSourceFiles(scanDir, files)

        val project = ArchestProject.parse(files)

        // 1. FileLocator assertions
        val mainFiles = project.getFiles(FileQueryOptions().matchNamePattern("src/main/"))
        mainFiles shouldNotDependOnFilesInFolder "test"

        val repoFiles = project.getFiles(FileQueryOptions().inFolder("repositories"))
        repoFiles shouldHaveMaxExportedFunctions 10L

        // 2. ClassLocator assertions
        val classes = project.getClasses()
        classes.shouldHaveNameMatchingFileName()

        val repoClasses = project.getClasses(ClassQueryOptions().matchNamePattern(".*Repository"))
        repoClasses shouldNotHaveModifier "abstract"

        // 3. FunctionLocator assertions
        val functions = project.getFunctions(FunctionQueryOptions().matchNamePattern("^locate.*"))
        functions.shouldHaveExplicitReturnType()

        // 4. LayeredArchitecture assertions
        val layered = project.layeredArchitecture()
            .layer("Repositories", "repositories")
            .layer("Services", "services")
            .layer("Controllers", "controllers")

        layered.whereLayer("Repositories").shouldOnlyBeAccessedBy("Services", "Controllers")
        layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers")

        layered.shouldPass()
    }
})

private fun locateSourceFiles(dir: File, files: MutableList<String>) {
    val list = dir.listFiles() ?: return
    for (file in list) {
        if (file.isDirectory) {
            val name = file.name
            if (name != "target" && name != "build" && name != "node_modules" && name != ".git" && name != ".turbo" && name != "out") {
                locateSourceFiles(file, files)
            }
        } else {
            val name = file.name
            if (name.endsWith(".java") || name.endsWith(".kt")) {
                files.add(file.absolutePath)
            }
        }
    }
}

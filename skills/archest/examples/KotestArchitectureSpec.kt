package org.archest.examples

import io.kotest.core.spec.style.StringSpec
import org.archest.core.*
import org.archest.kotest.*
import java.io.File

class KotestArchitectureSpec : StringSpec({
    "should validate architecture boundaries" {
        val files = mutableListOf<String>()
        locateSourceFiles(File("src/main/kotlin"), files)
        val project = ArchestProject.parse(files)

        // 1. Files in domain should not depend on infrastructure
        val domain = project.getFiles(FileQueryOptions().inFolder("domain"))
        domain shouldNotDependOnFilesInFolder "infrastructure"

        // 2. Class naming rules
        val services = project.getClasses(ClassQueryOptions().inFolder("services"))
        services shouldMatchNamePattern ".*Service$"

        // 3. Layered architecture validation
        val layered = project.layeredArchitecture()
            .layer("Domain", "domain")
            .layer("Services", "services")
            .layer("Controllers", "controllers")

        layered.whereLayer("Domain").shouldNotAccessAnyLayer()
        layered.whereLayer("Services").shouldOnlyBeAccessedBy("Controllers")

        layered.shouldPass()
    }
})

private fun locateSourceFiles(dir: File, result: MutableList<String>) {
    val list = dir.listFiles() ?: return
    for (f in list) {
        if (f.isDirectory) {
            locateSourceFiles(f, result)
        } else if (f.name.endsWith(".kt")) {
            result.add(f.absolutePath)
        }
    }
}

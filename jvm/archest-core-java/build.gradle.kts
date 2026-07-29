import java.io.File

plugins {
    kotlin("jvm")
    `java-library`
    `maven-publish`
}

dependencies {
    api(kotlin("stdlib"))
    api("net.java.dev.jna:jna:5.19.1")
    api("com.fasterxml.jackson.core:jackson-databind:2.22.1")
    api("com.fasterxml.jackson.module:jackson-module-kotlin:2.22.1")
    api("org.jspecify:jspecify:1.0.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.11.3")
}

// Locate the dynamic library compiled by Cargo
val cargoOutputDir = file("../../packages/core-rust/target/release")
val cargoDepsDir = file("../../packages/core-rust/target/release/deps")

val generateBindings = tasks.register("generateUniFFIBindings") {
    doLast {
        // Find compiled dynamic library (.dylib, .so, or .dll)
        val allFiles = (cargoOutputDir.listFiles()?.toList() ?: emptyList()) + (cargoDepsDir.listFiles()?.toList() ?: emptyList())
        val libFile = allFiles.firstOrNull { file ->
            val name = file.name
            (name.startsWith("libarchest_jvm") || name.startsWith("archest_jvm")) &&
                    (name.endsWith(".dylib") || name.endsWith(".so") || name.endsWith(".dll"))
        } ?: throw GradleException("Could not find compiled archest_jvm native library in $cargoOutputDir or $cargoDepsDir. Run cargo build --release first.")

        println("Found native library: ${libFile.absolutePath}")

        // Run uniffi-bindgen to generate Kotlin source files
        val bindgenBin = if (System.getProperty("os.name").lowercase().contains("win")) {
            File(cargoOutputDir, "uniffi-bindgen.exe")
        } else {
            File(cargoOutputDir, "uniffi-bindgen")
        }

        if (!bindgenBin.exists()) {
            throw GradleException("Could not find uniffi-bindgen binary at ${bindgenBin.absolutePath}")
        }

        val process = ProcessBuilder(
            bindgenBin.absolutePath,
            "generate",
            "--library",
            libFile.absolutePath,
            "--language",
            "kotlin",
            "--out-dir",
            file("src/main/kotlin").absolutePath
        ).directory(file("../../packages/core-rust"))
         .inheritIO()
         .start()

        val exitCode = process.waitFor()
        if (exitCode != 0) {
            throw GradleException("UniFFI bindgen failed with exit code $exitCode")
        }
    }
}

// Hook into Kotlin compilation
tasks.compileKotlin {
    dependsOn(generateBindings)
}

// Copy compiled native library into resources folder at build time
val copyNativeLib = tasks.register<Copy>("copyNativeLib") {
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
    into(file("src/main/resources"))

    into("darwin-aarch64") {
        from(cargoOutputDir) { include("libarchest_jvm.dylib") }
        from(cargoDepsDir) { include("libarchest_jvm.dylib") }
    }
    
    into("linux-x86-64") {
        from(cargoOutputDir) { include("libarchest_jvm.so") }
        from(cargoDepsDir) { include("libarchest_jvm.so") }
    }
    
    into("win32-x86-64") {
        from(cargoOutputDir) { include("archest_jvm.dll", "libarchest_jvm.dll") }
        from(cargoDepsDir) { include("archest_jvm.dll", "libarchest_jvm.dll") }
    }
}

tasks.processResources {
    dependsOn(copyNativeLib)
}

tasks.withType<Jar>().configureEach {
    dependsOn(copyNativeLib)
}

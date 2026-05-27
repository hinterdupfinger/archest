import org.gradle.api.publish.PublishingExtension
import org.gradle.api.publish.maven.MavenPublication
import org.gradle.api.publish.maven.plugins.MavenPublishPlugin

plugins {
    kotlin("jvm") version "2.2.0" apply false
    `maven-publish`
}

val packageJsonFile = file("../package.json")
val packageVersion = if (packageJsonFile.exists()) {
    val content = packageJsonFile.readText()
    val match = Regex("\"version\"\\s*:\\s*\"([^\"]+)\"").find(content)
    match?.groupValues?.get(1) ?: "0.1.0"
} else {
    "0.1.0"
}

val isRelease = System.getenv("GITHUB_REF")?.startsWith("refs/tags/v") ?: false

allprojects {
    group = "org.archest"
    version = if (isRelease) {
        System.getenv("GITHUB_REF_NAME")?.removePrefix("v") ?: packageVersion
    } else {
        "$packageVersion-SNAPSHOT"
    }

    repositories {
        mavenCentral()
    }
}

subprojects {
    plugins.withType<JavaBasePlugin> {
        configure<JavaPluginExtension> {
            toolchain {
                languageVersion.set(JavaLanguageVersion.of(26))
            }
        }
    }

    plugins.withType<JavaPlugin> {
        configure<JavaPluginExtension> {
            withSourcesJar()
            withJavadocJar()
        }
    }

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        }
    }
    
    tasks.withType<JavaCompile>().configureEach {
        targetCompatibility = "17"
        sourceCompatibility = "17"
    }

    tasks.withType<Test>().configureEach {
        useJUnitPlatform()
    }

    plugins.withType<MavenPublishPlugin> {
        configure<PublishingExtension> {
            publications {
                create<MavenPublication>("mavenJava") {
                    from(components["java"])
                }
            }
            repositories {
                maven {
                    name = "GitHubPackages"
                    url = uri("https://maven.pkg.github.com/hinterdupfinger/archest")
                    credentials {
                        username = System.getenv("GITHUB_ACTOR")
                        password = System.getenv("GITHUB_TOKEN")
                    }
                }
            }
        }
    }
}





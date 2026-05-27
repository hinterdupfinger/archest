plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "archest-jvm-root"

include("archest-core-java")
include("archest-junit6")
include("archest-kotest")


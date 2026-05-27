plugins {
    kotlin("jvm")
    `java-library`
    `maven-publish`
}

dependencies {
    api(project(":archest-core-java"))
    api("io.kotest:kotest-assertions-core:5.9.0")
    implementation("org.jspecify:jspecify:1.0.0")
    testImplementation("io.kotest:kotest-runner-junit5:5.9.0")
}

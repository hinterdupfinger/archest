plugins {
    kotlin("jvm")
    `java-library`
    `maven-publish`
}

dependencies {
    api(project(":archest-core-java"))
    api("org.junit.jupiter:junit-jupiter-api:6.0.0")
    implementation("org.jspecify:jspecify:1.0.0")
    
    testImplementation("org.junit.jupiter:junit-jupiter-engine:6.0.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher:6.0.0")
}

// Add to repositories block
repositories {
    mavenCentral()
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/hinterdupfinger/archest")
        credentials {
            username = System.getenv("GITHUB_ACTOR") ?: "YOUR_GITHUB_USERNAME"
            password = System.getenv("GITHUB_TOKEN") ?: "YOUR_GITHUB_TOKEN"
        }
    }
}

// Add to dependencies block
dependencies {
    // For pure Java / Core API
    testImplementation("org.archest:archest-core-java:0.1.0")
    
    // For JUnit 6 (Jupiter) Integration
    testImplementation("org.archest:archest-junit6:0.1.0")
    
    // For Kotest (Kotlin DSL) Integration
    testImplementation("org.archest:archest-kotest:0.1.0")
}

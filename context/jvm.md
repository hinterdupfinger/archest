# JVM Integration (Java & Kotlin)

The framework exports dynamic bindings to Gradle subprojects located in the `jvm/` directory targeting **JUnit 6** and **Kotest**.

## Core Guidelines

* **JDK 26 & Foojay Toolchains**: Compilation and execution run on **JDK 26** resolved automatically via `org.gradle.toolchains.foojay-resolver-convention` (version `1.0.0`).
* **Bytecode Target Constraints**: Despite compiling with JDK 26, bytecode output targets must remain compatible with **Java 17**. Ensure both `JavaCompile` and `KotlinCompile` tasks remain pinned to JVM target `17` to prevent target mismatch compiler errors and support runtime execution on Java 17.
* **JNA Dynamic Library Packaging**:
  * JNA loads native dynamic libraries automatically using platform-specific subdirectory naming conventions inside the JAR resource path.
  * Any JNI/UniFFI compiled binaries (`libarchest_jvm.*` and `archest_jvm.*`) must be copied into standard JNA platform folders: `darwin-aarch64`, `linux-x86-64`, and `win32-x86-64` at the classpath root (`src/main/resources/`).
  * To avoid Gradle implicit task dependency validation errors, all `Jar` packaging tasks (e.g. `sourcesJar`, `kotlinSourcesJar`, `javadocJar`) must declare an explicit dependency on the `copyNativeLib` task.
  * **Generated Source Files**: The UniFFI Kotlin bindings (`archest_jvm.kt`) are dynamically generated during the Gradle build process under `jvm/archest-core-java/src/main/kotlin/uniffi/archest_jvm/`. These files are ignored by Git (`.gitignore`) to keep version control clean. In the CI/CD pipeline, the `uniffi-bindgen` tool is built and cached in the `build-native` job and passed to JVM build tasks to generate files on the fly.

## Local Development & Compilation

Because Gradle relies on precompiled Rust JNI binaries and the `uniffi-bindgen` tool to generate Kotlin sources and bundle resources, you **MUST** compile the Rust backend before building the Gradle project.

### 1. Build the Rust JNI Binaries Locally
Run the following commands in the `packages/core-rust/` directory to build the JNI library and the UniFFI CLI tool:
```bash
cargo build --release -p archest-jvm
cargo build --release -p archest-jvm --bin uniffi-bindgen
```
*Note: The Gradle tasks scan `packages/core-rust/target/release` and `deps/` to locate these binaries.*

### 2. Running JVM Tests
Once the Rust binaries are built, you can execute all JUnit 6 and Kotest tests via:
```bash
cd jvm && ./gradlew test
```

### 3. Importing into an IDE (e.g. IntelliJ IDEA)
When working with the `jvm/` subprojects in an IDE:
1. Ensure you have run the `cargo` build commands above first.
2. Import the `jvm/` folder as a Gradle project.
3. If you encounter missing class references for generated native classes (e.g. `uniffi.archest_jvm.ArchestProject`), run `./gradlew generateUniFFIBindings` or build the Gradle project to trigger UniFFI source generation.

---

## API Parity & AST Parsing Gotchas

* **Unified API Parity**: Any new locator option, matcher, or rule check added to the JS/TS packages (`@archest/vitest` or `@archest/jest`) **MUST** be implemented in `archest-core-java` (via `RuleChecks`, locators, and query options), integrated into `archest-junit6` (`ArchestAssertions`), and exposed as idiomatic extension/infix functions in `archest-kotest` (`KotestMatchers.kt`) to keep both backends fully synchronized.
* **Kotlin Class Parsing Limitation**: The underlying native Rust Tree-Sitter JNI parser for Kotlin does not bind the class name identifier to a `"name"` field, resulting in `classData.name()` returning `null` (or `"Anonymous"`). To prevent false positives in rules like `classCheckHaveNameMatchingFileName`, gracefully handle or skip filename checks when all class names in a file are null.
* **Regex Escaping Differences**: Java's `Pattern.compile` and string replacement behaviors for regex character classes differ from JavaScript. Do not use complex nested square bracket regexes (e.g. `[.+?^${}()|[\]\\]`) directly in string replacements; instead, use the character-by-character `escapeRegex` logic in `ArchestProject.java` to prevent `PatternSyntaxException`.
* **Testing Exclusions**: When asserting dependencies like `notToDependOnFilesInFolder("test")`, ensure you filter the locator query to `src/main/` to prevent test source files from failing the check due to local test-to-test imports.


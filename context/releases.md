# Version Management & Release Flow

Guidelines on repository version tracking, package dependencies, and CI/CD publishing.

## Version Tracking

* **Source of Truth**: The root-level [`package.json`](file:///Users/jonathan/projects/vitest-arch/package.json) is the single source of truth for version numbers.
* **Gradle Projects**: Subproject version numbers are resolved dynamically at build time by reading the root `package.json` version and appending `-SNAPSHOT` for development builds (or using the release tag value when deployed in CI). Do not hardcode versions inside JVM subproject build scripts.
* **Rust Workspace Crates**: Track and increment versions manually inside their respective `Cargo.toml` manifests under `packages/core-rust/` when making changes that require publishing native binaries.

---

## CI/CD Integration

The CI workflow in `.github/workflows/ci.yml` builds dynamic JNI libraries for macOS, Windows, and Linux in a matrix job, bundles them into a single multi-platform JAR, and publishes them to the **GitHub Packages Maven Registry** upon release tag triggers (`v*`). Do not modify coordinates (`org.archest`) or the repository endpoint unless instructed.

# Project Structure Analysis & User Clarification Guidelines

When using this skill on a codebase, you must first discover the existing project structure and interact with the user to clarify the architectural rules they want to enforce. 

Do not guess the codebase's design or write assumptions-based tests. Follow these two protocols step-by-step:

---

## 1. Project Structure Discovery Protocol

Perform a quick audit of the project to locate source files, configurations, and test setups:

1.  **Identify the Tech Stack & Build Tool**:
    *   Look for `package.json`, `tsconfig.json`, or workspace configuration files at the root (identifies JS/TS projects).
    *   Look for `build.gradle`, `build.gradle.kts`, or `pom.xml` (identifies JVM projects).
2.  **Audit the Folder Layout**:
    *   Locate where the primary source files live (e.g. `src/main/`, `src/features/`, `src/core/`, `app/`).
    *   Identify the directory names to see if they follow a known architectural style (e.g. `domain/`, `infrastructure/`, `controllers/`, `services/`, `repositories/`, `slices/`).
3.  **Find Existing Tests**:
    *   Search for existing test directories or files (e.g., `*.test.ts`, `*Spec.kt`, `*Test.java`).
    *   Check if there are already any architecture tests in place (e.g., searching for imports of `@archest/vitest`, `ArchestAssertions`, or `ArchUnit`).

---

## 2. Relentless User Clarification Protocol (MANDATORY)

Before drafting or writing any architectural rules, you **MUST** pause and ask the user to clarify their design requirements. 

Present a structured list of questions to resolve ambiguity:

### A. Architectural Style & Boundaries
*   What is the architectural style of this codebase (e.g. Clean Architecture, Ports & Adapters/Hexagonal, Layered N-Tier, Feature-Sliced Design)?
*   What are the strict boundaries we need to enforce? (e.g., *"Should domain have zero dependencies?"*, *"Should controllers only import services?"*).

### B. Artifact Documentation
*   Is there any existing documentation, architecture diagram, or design spec file in the repository describing the layer boundaries? If so, please provide the path or paste its content.

### C. Naming & Structure Conventions
*   Do we need to enforce naming conventions on classes or files? (e.g. *"Must all classes in the `controllers` folder end with `Controller`?"*, *"Must services be exported stand-alone?"*).
*   Are there strict code quality metrics we want to assert (e.g. maximum cyclomatic complexity, minimum maintainability index, or cycle detection on specific folders)?

### D. Exceptions & Legacy Technical Debt
*   Are there any files or folders that currently violate these rules but should be treated as exceptions/whitelisted for now?

---

## 3. Workflow Progression

1.  **Audit**: Run discovery commands to map out the folder structures.
2.  **Clarify**: Ask the user the questions above.
3.  **Plan**: Draft the proposed rules in natural language in your implementation plan and obtain the user's explicit approval.
4.  **Implement**: Write the architecture tests, verify them against the codebase, and verify the negative failure cases.

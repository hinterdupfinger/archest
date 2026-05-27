# Architectural Testing & Automated Fitness Functions

Architectural testing is the practice of writing automated tests that verify whether your implementation adheres to its intended software architecture and design boundaries. 

By executing these rules inside your test runner, you establish automated guardrails that prevent structural erosion and codebase coupling as the system evolves.

---

## 1. The Challenge: Architectural Drift
In most active codebases, the biggest threat to software quality is not logic bugs, but **architectural drift** (or structural decay). 
*   **What it is**: Over time, as multiple developers add features, well-defined boundaries dissolve. A UI component directly imports a database driver; a repository calls a controller; domain logic becomes coupled to a specific framework.
*   **Why it happens**: Code reviews are highly effective for checking business logic, but humans are poor at tracing transient import chains and ensuring strict layer isolation across hundreds of files.
*   **The solution**: Automating these checks. By declaring rules in code and executing them in CI/CD, the build immediately fails when a boundary is violated.

---

## 2. Key Concept: Architectural Fitness Functions
Coined in the book *Building Evolutionary Architectures*, an **architectural fitness function** is any mechanism that provides an objective, automated integrity assessment of one or more architectural characteristics.

Architecture tests (using tools like ArchUnit in Java, or Archest in JS/TS/JVM) are the primary way developers write fitness functions for codebase structure. They verify quality attributes such as:
1.  **Modularity**: Ensuring code is divided into cohesive, independent parts.
2.  **Coupling/Cohesion**: Limiting incoming and outgoing dependencies between packages.
3.  **Maintainability**: Blocking overly complex or unmaintainable code structures.

---

## 3. Common Architectural Patterns & Rules

### A. Layered (N-Tier) Architectures
A classic architectural pattern is dividing code into horizontal tiers (e.g. UI -> Application -> Domain -> Infrastructure).
*   **Rule**: Higher-level layers can depend on lower-level layers, but **never** vice versa.
*   **Domain Isolation**: The core Domain layer must remain pure and have *zero* dependencies on outer layers (like databases, web routers, or frameworks).

### B. Feature-Sliced / Domain-Driven Design (DDD) Slices
Rather than horizontal layers, modern architectures often organize code vertically into feature slices or domain boundaries (e.g., `billing`, `auth`, `users`).
*   **Rule**: Slices must represent independent, isolated capabilities. 
*   **Crosstalk Checks**: Slices should never import directly from each other, or must do so strictly through predefined shared API interfaces. If `auth` depends on `billing` and `billing` depends on `auth`, it creates a massive circular dependency.

### C. Naming & Structural Conventions
Enforcing naming conventions aligns code with its functional role.
*   **Rule**: All classes residing in a `controllers/` folder must end with the name `Controller`. All classes ending with `Service` must be annotated with `@Service` or `@Injectable`.
*   **AST Properties**: Standalone functions inside a public SDK must explicitly declare their return types, ensuring API contracts are not accidentally modified.

---

## 4. Best Practices for Architecture Tests

To prevent architectural tests from becoming flaky or burdensome, follow these industry best practices:

*   **Focus on High-Value Rules First**: Start by enforcing rules that prevent major structural failures (like circular dependencies and domain-layer coupling). Do not write rules for trivial details.
*   **Treat Tests as Living Documentation**: Name your tests descriptively (e.g., `domain_layer_must_not_depend_on_infrastructure_layer`). This turns your test suite into an active, executable map of your architecture for new developers.
*   **Keep Rules Independent**: Write one test per rule. If a check fails, the test name should point directly to the specific architectural boundary that was breached.
*   **Run on Every Commit**: Add architectural checks to your pre-commit hooks or CI/CD pipelines. This stops violations from ever being merged into main.
*   **Scope Cycle Detection Wisely**: Checking for circular dependencies across an entire massive monorepo is highly CPU-intensive. Run cycle checks on specific domain boundaries or slices to keep your test suites fast.

---

## 5. Implementation Strategy: Step-by-Step Guide

When writing or modifying architecture tests, follow this sequence to ensure they are robust and correct:

### Step 1: Draft the Natural Language Rule
Before writing code, clearly formulate the rule and its rationale. E.g., *"Repositories must not import Controllers. Rationale: Data access layers should be decoupled from delivery mechanisms."*

### Step 2: Implement the Test DSL
Isolate the source component using queries and write the assertions. 
*   **Vitest example**:
    ```typescript
    it('repositories must not depend on controllers', () => {
      const repositories = project.getFiles({ inFolder: 'repositories' });
      expect(repositories).not.toDependOnFilesInFolder('controllers');
    });
    ```

### Step 3: Relentlessly Verify the Negative Case (Failure Mode Test)
An architecture test is only useful if it fails when it should. **Always test the negative case**:
1.  Temporarily add a deliberate violation in your codebase (e.g., import a controller helper into a repository class).
2.  Run the architecture test suite.
3.  **Confirm the test fails** and outputs a clear, actionable violation error message.
4.  Remove the temporary violation and confirm the test passes.

### Step 4: Handle Exceptions Gracefully
If there is a legitimate legacy exception that violates the rule, **do not disable the rule globally**.
*   Instead, narrow the scope of the check by excluding the file using the query options (e.g., adding it to `exclude` patterns in `parseProject` or filtering it out in your Java/Kotlin query options).
*   Add a comment explaining the technical debt and why the exception exists.

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

## 4. Counter-Checks & The Vacuous Rule Pitfall (CRITICAL)

The single most dangerous failure mode in architectural testing is the **vacuous test** (or false-positive pass). 

### What is a Vacuous Test?
A test passes *vacuously* when the selector query matches **zero** elements (due to a typo, an empty folder, a renamed directory, or an overly restrictive predicate). 

For example, consider this negative rule:
```typescript
it('domain should not depend on infrastructure', () => {
  const domain = project.getFiles({ inFolder: 'domain' });
  expect(domain).not.toDependOnFilesInFolder('infrastructure');
});
```
*   **The Trap**: If someone mistypes `'dmain'` or the `domain/` directory is moved/empty, `domain.files` has length `0`.
*   **Inverted Assertion Inversion**: In Vitest and Jest, custom matchers returning `pass: false` when 0 files match are inverted by `.not` (`!false` -> `true`). The test passes with a green checkmark!
*   **Target Invalidation**: If the `infrastructure/` folder is deleted or renamed to `infra/`, the check will never trigger any violations—giving false confidence while architecture drifts unchecked.

### Mandatory Counter-Check Pattern

To prevent vacuous passes, **every architecture test must include explicit counter-checks**:

#### 1. Source Non-Emptiness Counter-Check
Assert that your source selector matched at least one element before evaluating constraints:
```typescript
// TypeScript (Vitest / Jest)
const domain = project.getFiles({ inFolder: 'domain' });
expect(domain.files.length).toBeGreaterThan(0); // Source counter-check!
expect(domain).not.toDependOnFilesInFolder('infrastructure');
```
```java
// Java (JUnit 6)
FileLocator domain = project.getFiles(new FileQueryOptions().inFolder("domain"));
assertFalse(domain.getFiles().isEmpty(), "Counter-check: 'domain' folder must contain files");
ArchestAssertions.assertThat(domain).notToDependOnFilesInFolder("infrastructure");
```
```kotlin
// Kotlin (Kotest)
val domain = project.getFiles(FileQueryOptions(inFolder = "domain"))
domain.files.shouldNotBeEmpty() // Counter-check!
domain shouldNotDependOnFilesInFolder "infrastructure"
```

#### 2. Target Boundary Sanity Counter-Check
Assert that the forbidden target boundary actually exists and contains files in the analyzed project:
```typescript
const infrastructure = project.getFiles({ inFolder: 'infrastructure' });
expect(infrastructure.files.length).toBeGreaterThan(0); // Target counter-check!
```

---

## 5. Catalog of Best Architecture Tests to Include

When designing an architectural test suite, prioritize these **6 high-value test archetypes** based on industry standards (ArchUnit, Clean Architecture, DDD, and Evolutionary Fitness Functions):

### 1. Inward Dependency Enforcement (Clean / Hexagonal / Onion)
*   **Concept**: Dependencies must strictly point inward toward the domain. Domain entities and use cases must never know about delivery mechanisms (web/UI), data persistence (DB/ORM), or external infrastructure.
*   **Pattern**:
    ```typescript
    it('domain must remain pure and free from infrastructure dependencies', () => {
      const domain = project.getFiles({ inFolder: 'domain' });
      const infra = project.getFiles({ inFolder: 'infrastructure' });
      expect(domain.files.length).toBeGreaterThan(0);
      expect(infra.files.length).toBeGreaterThan(0);
      expect(domain).not.toDependOnFilesInFolder('infrastructure');
    });
    ```

### 2. Framework & Persistence Agnosticism (Zero Framework Bleed)
*   **Concept**: Domain logic must not leak dependencies on ORMs (Prisma, TypeORM, Mongoose, Hibernate/JPA) or HTTP transport frameworks (Express, Fastify, NestJS, Spring Web).
*   **Pattern**:
    ```typescript
    it('domain layer must not depend on external database ORMs or transport libraries', () => {
      const domain = project.getFiles({ inFolder: 'domain' });
      expect(domain.files.length).toBeGreaterThan(0);
      expect(domain).not.toDependOnExternalModule('@prisma/client');
      expect(domain).not.toDependOnExternalModule('typeorm');
      expect(domain).not.toDependOnExternalModule('express');
    });
    ```

### 3. Circular Dependency & Cycle Elimination
*   **Concept**: Cycles between packages, files, or domain slices lead to tight coupling, memory leaks, and fragile codebases that cannot be tested or deployed independently.
*   **Pattern**:
    ```typescript
    it('feature slices must be completely free of cyclic dependencies', () => {
      const slices = project.getSlices('src/modules/*');
      expect(slices.slices.length).toBeGreaterThan(0);
      expect(slices).toBeFreeOfCycles();
    });

    it('core files must not form dependency cycles', () => {
      const coreFiles = project.getFiles({ inFolder: 'core' });
      expect(coreFiles.files.length).toBeGreaterThan(0);
      expect(coreFiles).toBeFreeOfCycles();
    });
    ```

### 4. Cross-Slice Isolation (DDD / Feature-Sliced Design / Modular Monolith)
*   **Concept**: Autonomous feature slices (e.g. `billing`, `auth`, `catalog`, `orders`) must not import private internal files of other slices. Communication must occur strictly via public interfaces or shared contracts.
*   **Pattern**:
    ```typescript
    it('billing slice must not reach into private auth internals', () => {
      const billing = project.getFiles({ inFolder: 'modules/billing' });
      expect(billing.files.length).toBeGreaterThan(0);
      expect(billing).not.toDependOnFilesInFolder('modules/auth/internal');
    });
    ```

### 5. Structural, Naming & Contract Symmetry
*   **Concept**: Enforces code organization by role. Classes placed in specific folders must honor naming and interface contracts, maintaining consistency across large teams.
*   **Pattern**:
    ```typescript
    it('classes in controllers must end with Controller and reside in correct folder', () => {
      const controllers = project.getClasses({ inFolder: 'controllers' });
      expect(controllers.classes.length).toBeGreaterThan(0);
      expect(controllers).toMatchNamePattern(/Controller$/);
      expect(controllers).toResideInFolder('controllers');
    });

    it('repository classes must implement IRepository and end with Repository', () => {
      const repos = project.getClasses({ matchNamePattern: /Repository$/ });
      expect(repos.classes.length).toBeGreaterThan(0);
      expect(repos).toImplementInterface('IRepository');
    });

    it('exported classes and functions must match their parent file names', () => {
      const services = project.getClasses({ inFolder: 'services' });
      expect(services.classes.length).toBeGreaterThan(0);
      expect(services).toHaveNameMatchingFileName();
    });
    ```

### 6. Architectural Fitness & Maintainability Metrics
*   **Concept**: Protect against "god classes" and unmaintainable legacy spikes by establishing quantifiable complexity thresholds.
*   **Pattern**:
    ```typescript
    it('domain functions must enforce strict complexity and maintainability limits', () => {
      const domainFunctions = project.getFunctions({ inFolder: 'domain' });
      expect(domainFunctions.functions.length).toBeGreaterThan(0);
      expect(domainFunctions).toHaveMaxCyclomaticComplexity(10);
      expect(domainFunctions).toHaveMinMaintainabilityIndex(65);
      expect(domainFunctions).toHaveExplicitReturnType();
    });

    it('architecture slices must stay close to the Main Sequence (balanced abstraction/stability)', () => {
      const slices = project.getSlices('src/packages/*');
      expect(slices.slices.length).toBeGreaterThan(0);
      expect(slices).toHaveMaxDistanceFromMainSequence(0.3);
    });
    ```

---

## 6. Implementation Strategy: Step-by-Step Guide

When writing or modifying architecture tests, follow this sequence:

### Step 1: Draft the Natural Language Rule & Counter-Check Requirement
Formulate the rule and define the expected minimum element count. E.g., *"Repositories must not import Controllers. Both folders must contain files in src/."*

### Step 2: Implement the Test DSL with Explicit Counter-Checks
```typescript
it('repositories must not depend on controllers', () => {
  const repositories = project.getFiles({ inFolder: 'repositories' });
  const controllers = project.getFiles({ inFolder: 'controllers' });

  // 1. Source & target counter-checks
  expect(repositories.files.length).toBeGreaterThan(0);
  expect(controllers.files.length).toBeGreaterThan(0);

  // 2. Architectural constraint
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
If there is a legitimate legacy exception that violates the rule, **do not disable the rule globally**:
*   Narrow the scope by excluding the file in `parseProject({ exclude: [...] })` or filtering query options.
*   Add a comment explaining the technical debt and why the exception exists.


---
sidebar_position: 2
---

# Class Rules

Class rules allow you to deeply inspect the AST of TypeScript classes to assert formatting, naming, and structural requirements. This is especially useful for enforcing framework-specific conventions (e.g., NestJS decorators) or object-oriented design patterns.

## Finding Classes
Start by calling `project.getClasses(options)`.

You can filter classes using the `ClassQueryOptions` object:
- **`inFolder`**: Restricts the query to classes physically located in the specified folder name.
- **`matchNamePattern`**: Restricts the query to classes whose name matches the given pattern (string or RegExp).
- **`withDecorator`**: Restricts the query to classes annotated with a specific decorator (e.g., `'Injectable'`).
- **`extending`**: Restricts the query to classes that `extend` the given base class.
- **`implementing`**: Restricts the query to classes that `implements` the given interface.
- **`havingModifier`**: Restricts the query to classes that have the given AST modifier (e.g., `'export'`, `'abstract'`, `'default'`).

## Assertions

Use the returned locator inside `expect()` to assert class characteristics. All assertions support `.not` for negation.

### Example: Enforcing NestJS Conventions

If you are using a framework like NestJS, you can enforce that all controllers are properly decorated and named.

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

// 1. All classes ending with 'Controller' MUST reside in a 'controllers' folder.
const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
expect(controllers).toResideInFolder('controllers');

// 2. All classes in the 'controllers' folder MUST be exported and have the @Controller decorator
const folderClasses = project.getClasses({ inFolder: 'controllers' });
expect(folderClasses).toHaveModifier('export');
// (Note: custom matchers for decorators like toHaveDecorator are easily achievable, 
// but you can also use queries to ensure parity)
const decoratedControllers = project.getClasses({ withDecorator: 'Controller' });
expect(decoratedControllers).toMatchNamePattern(/Controller$/);
```

### Example: Enforcing OOP Interfaces

Ensure that certain layers adhere to specific interfaces or base classes.

```typescript
const repositories = project.getClasses({ matchNamePattern: /Repository$/ });

// Ensure all repositories implement the BaseRepository interface
expect(repositories).toImplementInterface('BaseRepository');

// Ensure all Data Access Objects extend a BaseEntity
const daos = project.getClasses({ inFolder: 'dao' });
expect(daos).toExtendClass('BaseEntity');

// Negation: Ensure controllers do NOT implement repository interfaces
expect(controllers).not.toImplementInterface('BaseRepository');
```

## Available Matchers

- `.toResideInFolder(folder: string)`
- `.toMatchNamePattern(pattern: string | RegExp)`
- `.toHaveModifier(modifier: 'export' | 'default' | 'abstract')`
- `.toExtendClass(className: string)`
- `.toImplementInterface(interfaceName: string)`
- `.toHaveNameMatchingFileName()`
- `.toHaveMaxCyclomaticComplexity(max: number)`

:::warning[Gotcha: Anonymous Classes]
Default exported classes without a name (`export default class {}`) are parsed as "Anonymous Class" by Archest. Pattern matchers (`toMatchNamePattern`) will fail on anonymous classes unless you explicitly provide a name.
:::

:::danger[Anti-Pattern: Over-constraining base classes]
Be careful when enforcing `toExtendClass` across a massive domain. Favor composition over inheritance. It's often better to check `toImplementInterface` to enforce behavior without locking your architecture into deep inheritance trees.
:::

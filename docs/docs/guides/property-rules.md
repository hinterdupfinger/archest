---
sidebar_position: 5
---

# Property Rules

Property rules allow you to inspect the characteristics of class properties across your project. This is highly useful for guaranteeing immutability across data transfer objects (DTOs) or state management models.

## Finding Properties
Start by calling `project.getProperties(options)`.

You can filter properties using the `PropertyQueryOptions` object:
- **`inFolder`**: Restricts the query to properties physically located in `folder`.
- **`matchNamePattern`**: Restricts the query to properties whose name matches the given pattern (string or RegExp).

## Assertions

```typescript
import { parseProject } from '@archest/vitest';
import { expect } from 'vitest';

const project = parseProject();

// Example 1: Strict Immutability for specific properties
// Ensure all properties named 'id' across the entire codebase are marked as readonly
const idProps = project.getProperties({ matchNamePattern: /^id$/ });
expect(idProps).toBeReadonly();

// Example 2: Immutability for entire layers
// Ensure all properties in the Data Transfer Objects (dto) folder are readonly
const dtoProps = project.getProperties({ inFolder: 'dto' });
expect(dtoProps).toBeReadonly();

// Example 3: Negation
// Ensure mutable state properties are NOT readonly
const stateProps = project.getProperties({ inFolder: 'state' });
expect(stateProps).not.toBeReadonly();
```

## Available Matchers

- `.toBeReadonly()`

:::warning[Gotcha: Interface Properties vs Class Properties]
`getProperties` only inspects actual `ClassDeclaration` properties. It does not parse `InterfaceDeclaration` properties. If you need to ensure an interface property is readonly, use standard TypeScript compiler checks.
:::

:::tip[State Management]
If you are using libraries like Redux or Vuex where state mutations are handled via specific reducers/mutations, enforcing `.toBeReadonly()` on your core model properties guarantees that junior developers don't accidentally mutate state directly.
:::

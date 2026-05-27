[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / ArchestMatchers

# Interface: ArchestMatchers\<_R\>

Defined in: [jest/src/matchers/models.ts:7](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L7)

Native Vitest Matchers provided by Archest for architectural testing.

This interface extends Vitest's `Assertion` interface to provide fluent assertions
on your codebase's architectural structure.

## Type Parameters

### _R

`_R` = `unknown`

## Methods

### toBeFreeOfCycles()

> **toBeFreeOfCycles**(): `void`

Defined in: [jest/src/matchers/models.ts:146](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L146)

Analyzes the AST dependency graph and asserts that the queried elements are entirely free of circular dependencies.
Supports FileLocators and SliceLocators.

#### Returns

`void`

#### Example

```typescript
const domainFiles = project.getFiles({ inFolder: 'domain' });
expect(domainFiles).toBeFreeOfCycles();
```

***

### toBeReadonly()

> **toBeReadonly**(): `void`

Defined in: [jest/src/matchers/models.ts:105](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L105)

Asserts that the located properties are marked as readonly.
Supports PropertyLocators.

#### Returns

`void`

#### Example

```typescript
const dtoProps = project.getProperties({ classPattern: /Dto$/ });
expect(dtoProps).toBeReadonly();
```

***

### toDependOnExternalModule()

> **toDependOnExternalModule**(`moduleName`): `void`

Defined in: [jest/src/matchers/models.ts:134](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L134)

Asserts that a file locator depends on a specific external module (e.g. from node_modules).
Supports FileLocators.

#### Parameters

##### moduleName

`string` \| `RegExp`

The exact string name or RegExp of the external package (e.g. 'vue', 'lodash').

#### Returns

`void`

#### Example

```typescript
it('should only use gql-tada inside the graphql module', () => {
  expect(
    project.files().not.matching(/src/graphql//)
  ).not.toDependOnExternalModule('gql-tada');
});
```

***

### toDependOnFilesInFolder()

> **toDependOnFilesInFolder**(`folder`): `void`

Defined in: [jest/src/matchers/models.ts:118](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L118)

Asserts that the located files import dependencies from the specified folder.
Supports FileLocators.

#### Parameters

##### folder

`string`

The target folder that must be imported.

#### Returns

`void`

#### Example

```typescript
const uiFiles = project.getFiles({ inFolder: 'ui' });
expect(uiFiles).not.toDependOnFilesInFolder('database');
```

***

### toExtendClass()

> **toExtendClass**(`className`): `void`

Defined in: [jest/src/matchers/models.ts:68](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L68)

Asserts that the located classes extend the specified base class.
Supports ClassLocators.

#### Parameters

##### className

`string`

The name of the class that must be extended.

#### Returns

`void`

#### Example

```typescript
const repositories = project.getClasses({ matchNamePattern: /Repository$/ });
expect(repositories).toExtendClass('BaseRepository');
```

***

### toHaveExplicitReturnType()

> **toHaveExplicitReturnType**(): `void`

Defined in: [jest/src/matchers/models.ts:93](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L93)

Asserts that the located functions have an explicit TypeScript return type.
Supports FunctionLocators.

#### Returns

`void`

#### Example

```typescript
const domainFunctions = project.getFunctions({ inFolder: 'domain' });
expect(domainFunctions).toHaveExplicitReturnType();
```

***

### toHaveMaxCyclomaticComplexity()

> **toHaveMaxCyclomaticComplexity**(`max`): `void`

Defined in: [jest/src/matchers/models.ts:172](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L172)

Computes the cyclomatic complexity of the AST and asserts it is less than or equal to the maximum.
Supports FileLocators, ClassLocators, and FunctionLocators.

#### Parameters

##### max

`number`

The maximum allowed cyclomatic complexity.

#### Returns

`void`

#### Example

```typescript
const coreFunctions = project.getFunctions({ inFolder: 'core' });
expect(coreFunctions).toHaveMaxCyclomaticComplexity(10);
```

***

### toHaveMaxDistanceFromMainSequence()

> **toHaveMaxDistanceFromMainSequence**(`max`): `void`

Defined in: [jest/src/matchers/models.ts:198](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L198)

Computes the Robert C. Martin Distance from the Main Sequence for the slice and asserts it is less than or equal to the maximum.
Supports SliceLocators.

#### Parameters

##### max

`number`

The maximum allowed distance from the main sequence (0 to 1).

#### Returns

`void`

#### Example

```typescript
const slices = project.getSlices('modules/(*)/');
expect(slices).toHaveMaxDistanceFromMainSequence(0.3);
```

***

### toHaveMaxExportedFunctions()

> **toHaveMaxExportedFunctions**(`max`): `void`

Defined in: [jest/src/matchers/models.ts:223](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L223)

Asserts that the located file does not export more than the specified maximum number of functions.
Supports FileLocators.

#### Parameters

##### max

`number`

The maximum number of allowed exported functions per file.

#### Returns

`void`

#### Example

```typescript
const utils = project.getFiles({ inFolder: 'utils' });
expect(utils).toHaveMaxExportedFunctions(5);
```

***

### toHaveMinMaintainabilityIndex()

> **toHaveMinMaintainabilityIndex**(`min`): `void`

Defined in: [jest/src/matchers/models.ts:185](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L185)

Computes the maintainability index based on Halstead metrics and asserts it is greater than or equal to the minimum.
Supports FileLocators and FunctionLocators.

#### Parameters

##### min

`number`

The minimum acceptable maintainability index (0-100).

#### Returns

`void`

#### Example

```typescript
const coreFiles = project.getFiles({ inFolder: 'core' });
expect(coreFiles).toHaveMinMaintainabilityIndex(65);
```

***

### toHaveModifier()

> **toHaveModifier**(`modifier`): `void`

Defined in: [jest/src/matchers/models.ts:47](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L47)

Asserts that the located elements have the specified TypeScript modifier.
Supports ClassLocators and FunctionLocators.

#### Parameters

##### modifier

`"export"` \| `"default"` \| `"abstract"` \| `"async"` \| `"private"` \| `"public"`

The AST modifier to enforce (e.g., 'export', 'abstract', 'async').

#### Returns

`void`

#### Example

```typescript
const helpers = project.getFunctions({ inFolder: 'utils' });
expect(helpers).toHaveModifier('export');
```

***

### toHaveNameMatchingFileName()

> **toHaveNameMatchingFileName**(): `void`

Defined in: [jest/src/matchers/models.ts:210](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L210)

Asserts that the exported class or function name exactly matches the name of its parent file.
Supports ClassLocators and FunctionLocators.

#### Returns

`void`

#### Example

```typescript
const allFunctions = project.getFunctions();
expect(allFunctions).toHaveNameMatchingFileName();
```

***

### toImplementInterface()

> **toImplementInterface**(`interfaceName`): `void`

Defined in: [jest/src/matchers/models.ts:81](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L81)

Asserts that the located classes implement the specified interface.
Supports ClassLocators.

#### Parameters

##### interfaceName

`string`

The name of the interface that must be implemented.

#### Returns

`void`

#### Example

```typescript
const useCases = project.getClasses({ inFolder: 'use-cases' });
expect(useCases).toImplementInterface('IUseCase');
```

***

### toMatchNamePattern()

> **toMatchNamePattern**(`pattern`): `void`

Defined in: [jest/src/matchers/models.ts:159](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L159)

Asserts that the name of the located element matches the provided string or RegExp pattern.
Supports FileLocators, ClassLocators, and FunctionLocators.

#### Parameters

##### pattern

`string` \| `RegExp`

The string or RegExp pattern that must match the name.

#### Returns

`void`

#### Example

```typescript
const controllers = project.getClasses({ withDecorator: 'Controller' });
expect(controllers).toMatchNamePattern(/Controller$/);
```

***

### toPass()

> **toPass**(): `void`

Defined in: [jest/src/matchers/models.ts:21](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L21)

Asserts that the evaluated architectural rule passes.
Primarily used for complex rules like LayeredArchitecture.

#### Returns

`void`

#### Example

```typescript
const architecture = project.layeredArchitecture()
  .layer('Domain', 'domain')
  .layer('Infrastructure', 'infrastructure');

expect(architecture.whereLayer('Domain').shouldNotAccessAnyLayer().check()).toPass();
```

***

### toResideInFolder()

> **toResideInFolder**(`folder`): `void`

Defined in: [jest/src/matchers/models.ts:34](https://github.com/hinterdupfinger/archest/blob/1e3da1fa1f1f2ec1018eb1c3c14fca0fa324ca17/packages/jest/src/matchers/models.ts#L34)

Asserts that the located elements physically reside within the specified folder.
Supports ClassLocators.

#### Parameters

##### folder

`string`

The folder name or path pattern the elements must reside in.

#### Returns

`void`

#### Example

```typescript
const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
expect(controllers).toResideInFolder('controllers');
```

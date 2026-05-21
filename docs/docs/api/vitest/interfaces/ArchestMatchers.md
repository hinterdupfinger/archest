[**@archest/vitest**](../README.md)

***

[@archest/vitest](../README.md) / ArchestMatchers

# Interface: ArchestMatchers\<R\>

Defined in: vitest/src/matchers/models.ts:7

Native Vitest Matchers provided by Archest for architectural testing.

This interface extends Vitest's `Assertion` interface to provide fluent assertions
on your codebase's architectural structure.

## Type Parameters

### R

`R` = `unknown`

## Methods

### toBeFreeOfCycles()

> **toBeFreeOfCycles**(): `void`

Defined in: vitest/src/matchers/models.ts:124

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

Defined in: vitest/src/matchers/models.ts:99

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

### toDependOnFilesInFolder()

> **toDependOnFilesInFolder**(`folder`): `void`

Defined in: vitest/src/matchers/models.ts:112

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

Defined in: vitest/src/matchers/models.ts:62

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

Defined in: vitest/src/matchers/models.ts:87

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

Defined in: vitest/src/matchers/models.ts:150

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

Defined in: vitest/src/matchers/models.ts:176

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

Defined in: vitest/src/matchers/models.ts:201

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

Defined in: vitest/src/matchers/models.ts:163

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

Defined in: vitest/src/matchers/models.ts:47

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

Defined in: vitest/src/matchers/models.ts:188

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

Defined in: vitest/src/matchers/models.ts:75

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

Defined in: vitest/src/matchers/models.ts:137

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

Defined in: vitest/src/matchers/models.ts:21

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

Defined in: vitest/src/matchers/models.ts:34

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

[**@archest/jest**](../README.md)

***

[@archest/jest](../README.md) / ParseProjectOptions

# Interface: ParseProjectOptions

Defined in: core/dist/project/parseProject.d.ts:9

Options to configure how the project is parsed and analyzed.

## Properties

### exclude?

> `optional` **exclude?**: `string`[]

Defined in: core/dist/project/parseProject.d.ts:18

An array of glob patterns specifying which files to exclude from the AST parsing. Overrides the tsconfig.json `exclude` array.

***

### include?

> `optional` **include?**: `string`[]

Defined in: core/dist/project/parseProject.d.ts:16

An array of glob patterns specifying which files to include in the AST parsing. Overrides the tsconfig.json `include` array.

***

### tsConfigFilePath?

> `optional` **tsConfigFilePath?**: `string`

Defined in: core/dist/project/parseProject.d.ts:14

An optional absolute path to a specific tsconfig.json file.
If omitted, Archest will attempt to find the nearest tsconfig.json in the current working directory.

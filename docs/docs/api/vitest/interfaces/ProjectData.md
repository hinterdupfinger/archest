[**@archest/vitest**](../README.md)

***

[@archest/vitest](../README.md) / ProjectData

# Interface: ProjectData

Defined in: core/dist/dto.d.ts:5

Represents the entire parsed project structure containing all analyzed files.
This is the root node returned by the native Rust parser.

## Properties

### files

> **files**: [`FileData`](FileData.md)[]

Defined in: core/dist/dto.d.ts:7

A list of all files that were successfully parsed in the project workspace.

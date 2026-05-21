/**
 * Native Vitest Matchers provided by Archest for architectural testing.
 *
 * This interface extends Vitest's `Assertion` interface to provide fluent assertions
 * on your codebase's architectural structure.
 */
export interface ArchestMatchers<_R = unknown> {
  /**
   * Asserts that the evaluated architectural rule passes.
   * Primarily used for complex rules like LayeredArchitecture.
   *
   * @example
   * ```typescript
   * const architecture = project.layeredArchitecture()
   *   .layer('Domain', 'domain')
   *   .layer('Infrastructure', 'infrastructure');
   *
   * expect(architecture.whereLayer('Domain').shouldNotAccessAnyLayer().check()).toPass();
   * ```
   */
  toPass(): void;

  /**
   * Asserts that the located elements physically reside within the specified folder.
   * Supports ClassLocators.
   *
   * @param folder - The folder name or path pattern the elements must reside in.
   * @example
   * ```typescript
   * const controllers = project.getClasses({ matchNamePattern: /Controller$/ });
   * expect(controllers).toResideInFolder('controllers');
   * ```
   */
  toResideInFolder(folder: string): void;

  /**
   * Asserts that the located elements have the specified TypeScript modifier.
   * Supports ClassLocators and FunctionLocators.
   *
   * @param modifier - The AST modifier to enforce (e.g., 'export', 'abstract', 'async').
   * @example
   * ```typescript
   * const helpers = project.getFunctions({ inFolder: 'utils' });
   * expect(helpers).toHaveModifier('export');
   * ```
   */
  toHaveModifier(
    modifier:
      | 'export'
      | 'default'
      | 'abstract'
      | 'async'
      | 'private'
      | 'public',
  ): void;

  /**
   * Asserts that the located classes extend the specified base class.
   * Supports ClassLocators.
   *
   * @param className - The name of the class that must be extended.
   * @example
   * ```typescript
   * const repositories = project.getClasses({ matchNamePattern: /Repository$/ });
   * expect(repositories).toExtendClass('BaseRepository');
   * ```
   */
  toExtendClass(className: string): void;

  /**
   * Asserts that the located classes implement the specified interface.
   * Supports ClassLocators.
   *
   * @param interfaceName - The name of the interface that must be implemented.
   * @example
   * ```typescript
   * const useCases = project.getClasses({ inFolder: 'use-cases' });
   * expect(useCases).toImplementInterface('IUseCase');
   * ```
   */
  toImplementInterface(interfaceName: string): void;

  /**
   * Asserts that the located functions have an explicit TypeScript return type.
   * Supports FunctionLocators.
   *
   * @example
   * ```typescript
   * const domainFunctions = project.getFunctions({ inFolder: 'domain' });
   * expect(domainFunctions).toHaveExplicitReturnType();
   * ```
   */
  toHaveExplicitReturnType(): void;

  /**
   * Asserts that the located properties are marked as readonly.
   * Supports PropertyLocators.
   *
   * @example
   * ```typescript
   * const dtoProps = project.getProperties({ classPattern: /Dto$/ });
   * expect(dtoProps).toBeReadonly();
   * ```
   */
  toBeReadonly(): void;

  /**
   * Asserts that the located files import dependencies from the specified folder.
   * Supports FileLocators.
   *
   * @param folder - The target folder that must be imported.
   * @example
   * ```typescript
   * const uiFiles = project.getFiles({ inFolder: 'ui' });
   * expect(uiFiles).not.toDependOnFilesInFolder('database');
   * ```
   */
  toDependOnFilesInFolder(folder: string): void;

  /**
   * Asserts that a file locator depends on a specific external module (e.g. from node_modules).
   * Supports FileLocators.
   *
   * @param moduleName - The exact string name or RegExp of the external package (e.g. 'vue', 'lodash').
   * @example
   * ```typescript
   * it('should only use gql-tada inside the graphql module', () => {
   *   expect(
   *     project.files().not.matching(/src\/graphql\//)
   *   ).not.toDependOnExternalModule('gql-tada');
   * });
   * ```
   */
  toDependOnExternalModule(moduleName: string | RegExp): void;

  /**
   * Analyzes the AST dependency graph and asserts that the queried elements are entirely free of circular dependencies.
   * Supports FileLocators and SliceLocators.
   *
   * @example
   * ```typescript
   * const domainFiles = project.getFiles({ inFolder: 'domain' });
   * expect(domainFiles).toBeFreeOfCycles();
   * ```
   */
  toBeFreeOfCycles(): void;

  /**
   * Asserts that the name of the located element matches the provided string or RegExp pattern.
   * Supports FileLocators, ClassLocators, and FunctionLocators.
   *
   * @param pattern - The string or RegExp pattern that must match the name.
   * @example
   * ```typescript
   * const controllers = project.getClasses({ withDecorator: 'Controller' });
   * expect(controllers).toMatchNamePattern(/Controller$/);
   * ```
   */
  toMatchNamePattern(pattern: string | RegExp): void;

  /**
   * Computes the cyclomatic complexity of the AST and asserts it is less than or equal to the maximum.
   * Supports FileLocators, ClassLocators, and FunctionLocators.
   *
   * @param max - The maximum allowed cyclomatic complexity.
   * @example
   * ```typescript
   * const coreFunctions = project.getFunctions({ inFolder: 'core' });
   * expect(coreFunctions).toHaveMaxCyclomaticComplexity(10);
   * ```
   */
  toHaveMaxCyclomaticComplexity(max: number): void;

  /**
   * Computes the maintainability index based on Halstead metrics and asserts it is greater than or equal to the minimum.
   * Supports FileLocators and FunctionLocators.
   *
   * @param min - The minimum acceptable maintainability index (0-100).
   * @example
   * ```typescript
   * const coreFiles = project.getFiles({ inFolder: 'core' });
   * expect(coreFiles).toHaveMinMaintainabilityIndex(65);
   * ```
   */
  toHaveMinMaintainabilityIndex(min: number): void;

  /**
   * Computes the Robert C. Martin Distance from the Main Sequence for the slice and asserts it is less than or equal to the maximum.
   * Supports SliceLocators.
   *
   * @param max - The maximum allowed distance from the main sequence (0 to 1).
   * @example
   * ```typescript
   * const slices = project.getSlices('modules/(*)/');
   * expect(slices).toHaveMaxDistanceFromMainSequence(0.3);
   * ```
   */
  toHaveMaxDistanceFromMainSequence(max: number): void;

  /**
   * Asserts that the exported class or function name exactly matches the name of its parent file.
   * Supports ClassLocators and FunctionLocators.
   *
   * @example
   * ```typescript
   * const allFunctions = project.getFunctions();
   * expect(allFunctions).toHaveNameMatchingFileName();
   * ```
   */
  toHaveNameMatchingFileName(): void;

  /**
   * Asserts that the located file does not export more than the specified maximum number of functions.
   * Supports FileLocators.
   *
   * @param max - The maximum number of allowed exported functions per file.
   * @example
   * ```typescript
   * const utils = project.getFiles({ inFolder: 'utils' });
   * expect(utils).toHaveMaxExportedFunctions(5);
   * ```
   */
  toHaveMaxExportedFunctions(max: number): void;
}

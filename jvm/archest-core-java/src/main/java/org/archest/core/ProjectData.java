package org.archest.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import java.util.List;

public record ProjectData(
    @NonNull List<FileData> files
) {
    public record FileData(
        @NonNull String path,
        @JsonProperty("package_name") @Nullable String packageName,
        @NonNull List<ClassData> classes,
        @NonNull List<FunctionData> functions,
        @NonNull List<PropertyData> properties,
        @NonNull List<String> dependencies,
        @JsonProperty("external_dependencies") @NonNull List<String> externalDependencies
    ) {}

    public record ClassData(
        @Nullable String name,
        @JsonProperty("is_exported") boolean isExported,
        @JsonProperty("is_default") boolean isDefault,
        @JsonProperty("is_abstract") boolean isAbstract,
        @JsonProperty("extends") @Nullable String extendsClass,
        @JsonProperty("implements") @NonNull List<String> implementsInterfaces,
        @NonNull List<String> decorators,
        @JsonProperty("cyclomatic_complexity") long cyclomaticComplexity,
        @JsonProperty("maintainability_index") long maintainabilityIndex
    ) {}

    public record FunctionData(
        @Nullable String name,
        @JsonProperty("is_exported") boolean isExported,
        @JsonProperty("is_async") boolean isAsync,
        @JsonProperty("is_top_level") boolean isTopLevel,
        @JsonProperty("has_explicit_return_type") boolean hasExplicitReturnType,
        @JsonProperty("cyclomatic_complexity") long cyclomaticComplexity,
        @JsonProperty("maintainability_index") long maintainabilityIndex
    ) {}

    public record PropertyData(
        @NonNull String name,
        @JsonProperty("is_readonly") boolean isReadonly
    ) {}
}

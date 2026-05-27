package org.archest.core;

import org.jspecify.annotations.NonNull;

public record JvmRuleResult(
    boolean pass,
    @NonNull String message
) {}

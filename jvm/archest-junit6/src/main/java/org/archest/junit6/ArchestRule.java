package org.archest.junit6;

import org.archest.core.ArchestProject;
import org.archest.core.JvmRuleResult;
import org.jspecify.annotations.NonNull;

@FunctionalInterface
public interface ArchestRule {
    @NonNull JvmRuleResult check(@NonNull ArchestProject project);
}

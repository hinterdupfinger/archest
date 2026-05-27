package org.archest.core;

import java.util.List;

public record FunctionLocator(
    List<FunctionLocatorItem> functions,
    ProjectData projectData
) {}

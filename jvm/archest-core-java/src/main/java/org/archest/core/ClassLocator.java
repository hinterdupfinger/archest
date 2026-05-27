package org.archest.core;

import java.util.List;

public record ClassLocator(
    List<ClassLocatorItem> classes,
    ProjectData projectData
) {}

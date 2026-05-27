package org.archest.core;

import java.util.List;

public record PropertyLocator(
    List<PropertyLocatorItem> properties,
    ProjectData projectData
) {}

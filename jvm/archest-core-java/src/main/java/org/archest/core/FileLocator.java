package org.archest.core;

import java.util.List;

public record FileLocator(
    List<ProjectData.FileData> files,
    ProjectData projectData,
    ArchestProject archestProject
) {}

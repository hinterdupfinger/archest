package org.archest.core;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

public record SliceLocator(
    Pattern slicePattern,
    Set<String> sliceIds,
    Map<String, List<ProjectData.FileData>> sliceFiles,
    ProjectData projectData
) {}

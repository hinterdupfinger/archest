package org.archest.core;

import java.util.regex.Pattern;

public class PropertyQueryOptions {
    private String inFolder;
    private Pattern matchNamePattern;

    public PropertyQueryOptions inFolder(String inFolder) {
        this.inFolder = inFolder;
        return this;
    }

    public PropertyQueryOptions matchNamePattern(String pattern) {
        this.matchNamePattern = Pattern.compile(pattern);
        return this;
    }

    public PropertyQueryOptions matchNamePattern(Pattern pattern) {
        this.matchNamePattern = pattern;
        return this;
    }

    public String getInFolder() {
        return inFolder;
    }

    public Pattern getMatchNamePattern() {
        return matchNamePattern;
    }
}

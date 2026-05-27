package org.archest.core;

import java.util.regex.Pattern;

public class FunctionQueryOptions {
    private String inFolder;
    private Pattern matchNamePattern;
    private Boolean isTopLevel;

    public FunctionQueryOptions inFolder(String inFolder) {
        this.inFolder = inFolder;
        return this;
    }

    public FunctionQueryOptions matchNamePattern(String pattern) {
        this.matchNamePattern = Pattern.compile(pattern);
        return this;
    }

    public FunctionQueryOptions matchNamePattern(Pattern pattern) {
        this.matchNamePattern = pattern;
        return this;
    }

    public FunctionQueryOptions isTopLevel(Boolean isTopLevel) {
        this.isTopLevel = isTopLevel;
        return this;
    }

    public String getInFolder() {
        return inFolder;
    }

    public Pattern getMatchNamePattern() {
        return matchNamePattern;
    }

    public Boolean getIsTopLevel() {
        return isTopLevel;
    }
}

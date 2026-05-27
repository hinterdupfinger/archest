package org.archest.core;

import java.util.regex.Pattern;

public class ClassQueryOptions {
    private String inFolder;
    private Pattern matchNamePattern;
    private String withDecorator;
    private String extending;
    private String implementing;
    private String havingModifier;

    public ClassQueryOptions inFolder(String inFolder) {
        this.inFolder = inFolder;
        return this;
    }

    public ClassQueryOptions matchNamePattern(String pattern) {
        this.matchNamePattern = Pattern.compile(pattern);
        return this;
    }

    public ClassQueryOptions matchNamePattern(Pattern pattern) {
        this.matchNamePattern = pattern;
        return this;
    }

    public ClassQueryOptions withDecorator(String decorator) {
        this.withDecorator = decorator;
        return this;
    }

    public ClassQueryOptions extending(String extending) {
        this.extending = extending;
        return this;
    }

    public ClassQueryOptions implementing(String implementing) {
        this.implementing = implementing;
        return this;
    }

    public ClassQueryOptions havingModifier(String modifier) {
        this.havingModifier = modifier;
        return this;
    }

    public String getInFolder() {
        return inFolder;
    }

    public Pattern getMatchNamePattern() {
        return matchNamePattern;
    }

    public String getWithDecorator() {
        return withDecorator;
    }

    public String getExtending() {
        return extending;
    }

    public String getImplementing() {
        return implementing;
    }

    public String getHavingModifier() {
        return havingModifier;
    }
}

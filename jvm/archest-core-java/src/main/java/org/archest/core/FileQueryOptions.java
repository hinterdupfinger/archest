package org.archest.core;

import java.util.regex.Pattern;

public class FileQueryOptions {
    private String inFolder;
    private Pattern matchNamePattern;
    private ClassQueryOptions hasClass;
    private FunctionQueryOptions hasFunction;

    public FileQueryOptions inFolder(String inFolder) {
        this.inFolder = inFolder;
        return this;
    }

    public FileQueryOptions matchNamePattern(String pattern) {
        this.matchNamePattern = Pattern.compile(pattern);
        return this;
    }

    public FileQueryOptions matchNamePattern(Pattern pattern) {
        this.matchNamePattern = pattern;
        return this;
    }

    public FileQueryOptions hasClass(ClassQueryOptions hasClass) {
        this.hasClass = hasClass;
        return this;
    }

    public FileQueryOptions hasFunction(FunctionQueryOptions hasFunction) {
        this.hasFunction = hasFunction;
        return this;
    }

    public String getInFolder() {
        return inFolder;
    }

    public Pattern getMatchNamePattern() {
        return matchNamePattern;
    }

    public ClassQueryOptions getHasClass() {
        return hasClass;
    }

    public FunctionQueryOptions getHasFunction() {
        return hasFunction;
    }
}

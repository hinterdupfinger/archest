package org.archest.junit6;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import static org.junit.jupiter.api.Assertions.*;

public class ArchestExtensionTest {

    @ExtendWith(ArchestExtension.class)
    @AnalyzeClasses(packages = "com.example")
    public static class SamplePassedTest {
        @ArchTest
        public static final ArchestRule repositoryShouldNotDependOnController =
            ArchestRules.classes().matching(".*Repository").shouldNotDependOn(".*Controller");
    }

    @ExtendWith(ArchestExtension.class)
    @AnalyzeClasses(packages = "com.example")
    public static class SampleFailedTest {
        @ArchTest
        public static final ArchestRule controllerShouldNotDependOnRepository =
            ArchestRules.classes().matching(".*Controller").shouldNotDependOn(".*Repository");
    }

    private ExtensionContext createMockContext(Class<?> testClass) {
        return (ExtensionContext) Proxy.newProxyInstance(
            ExtensionContext.class.getClassLoader(),
            new Class<?>[]{ExtensionContext.class},
            new InvocationHandler() {
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    if (method.getName().equals("getRequiredTestClass")) {
                        return testClass;
                    }
                    if (method.getName().equals("getTestClass")) {
                        return java.util.Optional.of(testClass);
                    }
                    if (method.getReturnType().equals(java.util.Optional.class)) {
                        return java.util.Optional.empty();
                    }
                    return null;
                }
            }
        );
    }

    @Test
    public void testExtensionPasses() throws Exception {
        ArchestExtension extension = new ArchestExtension();
        extension.beforeAll(createMockContext(SamplePassedTest.class));
    }

    @Test
    public void testExtensionFails() {
        ArchestExtension extension = new ArchestExtension();
        assertThrows(AssertionError.class, () -> {
            extension.beforeAll(createMockContext(SampleFailedTest.class));
        });
    }
}

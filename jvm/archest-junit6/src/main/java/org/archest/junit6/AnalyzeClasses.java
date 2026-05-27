package org.archest.junit6;

import org.junit.jupiter.api.extension.ExtendWith;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(ArchestExtension.class)
public @interface AnalyzeClasses {
    String[] packages();
}

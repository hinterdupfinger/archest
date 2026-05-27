package org.archest.core;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import org.jspecify.annotations.NonNull;

public class NativeLoader {
    private static boolean loaded = false;

    public static synchronized void load() {
        if (loaded) return;

        String os = System.getProperty("os.name").toLowerCase();
        String arch = System.getProperty("os.arch").toLowerCase();
        String libName;
        String dirName;

        if (os.contains("mac")) {
            dirName = arch.contains("aarch64") ? "darwin-aarch64" : "darwin-x86-64";
            libName = "libarchest_jvm.dylib";
        } else if (os.contains("nix") || os.contains("nux")) {
            dirName = "linux-x86-64";
            libName = "libarchest_jvm.so";
        } else if (os.contains("win")) {
            dirName = "win32-x86-64";
            libName = "archest_jvm.dll";
        } else {
            throw new UnsupportedOperationException("Unsupported OS/Arch: " + os + "/" + arch);
        }

        try {
            String path = "/" + dirName + "/" + libName;
            InputStream in = NativeLoader.class.getResourceAsStream(path);
            if (in == null) {
                throw new UnsatisfiedLinkError("Native library not found in resources: " + path);
            }
            File temp = File.createTempFile("archest_native_", "_" + libName);
            temp.deleteOnExit();
            Files.copy(in, temp.toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.load(temp.getAbsolutePath());
            loaded = true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load native Archest library", e);
        }
    }
}

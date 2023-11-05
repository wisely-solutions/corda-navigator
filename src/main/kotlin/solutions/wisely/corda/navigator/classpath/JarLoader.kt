package solutions.wisely.corda.navigator.classpath

import java.io.File
import java.net.URL
import java.net.URLClassLoader

object JarLoader {
    fun load() {
        urls().forEach { jar ->
            val method = URLClassLoader::class.java.getDeclaredMethod("addURL", java.net.URL::class.java)
            method.isAccessible = true
            method.invoke(ClassLoader.getSystemClassLoader(), jar.toURI().toURL())
        }
    }

    fun urls () : List<URL> {
        val directory = File(System.getenv("CORDAPP_DIR")?.ifBlank { null }?: "cordapps")
        if (!directory.exists() || !directory.isDirectory) {
            throw IllegalArgumentException("${directory.absolutePath} is invalid, no cordapps to load")
        }
        // Filter for only .jar files
        return directory.listFiles { _, name -> name.endsWith(".jar") }
            ?.map { it.toURI().toURL() } ?: listOf()
    }
}
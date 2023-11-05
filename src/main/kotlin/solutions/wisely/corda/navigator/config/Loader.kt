package solutions.wisely.corda.navigator.config

import java.io.File
import solutions.wisely.corda.navigator.json.Jackson

object ConfigLoader {
    private val configFile = File(System.getenv("CONFIG_FILE")?.ifBlank { null }?: "./config.json")
    fun load () : Configuration {
        return if (configFile.exists()) {
            Jackson.read<Configuration>(configFile)
        } else {
            Configuration()
        }
    }

    fun save (config: Configuration) {
        Jackson.write(config, configFile)
    }
}
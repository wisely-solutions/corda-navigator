package solutions.wisely.corda.navigator.json

import com.fasterxml.jackson.databind.Module
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import java.io.File
import java.nio.charset.Charset
import kotlin.reflect.KClass

object Jackson {
    private val mapper = ObjectMapper()
        .registerKotlinModule()
        .registerModule(DateModule())
        .registerModule(CordaModule())

    fun <T> read (file: File, type: KClass<*>) : T {
        @Suppress("UNCHECKED_CAST")
        return mapper.readValue(file, type.java) as T
    }
    fun <T> read (file: ByteArray, type: KClass<*>) : T {
        @Suppress("UNCHECKED_CAST")
        return mapper.readValue(file, type.java) as T
    }

    inline fun <reified T> read (file: File) : T {
        return read(file, T::class)
    }

    inline fun <reified T> read (content: String) : T {
        return read(content.toByteArray(Charset.defaultCharset()), T::class)
    }

    fun <T> write(config: T, output: File) {
        mapper.writeValue(output, config)
    }

    fun <T> writeToString(input: T): String {
        return mapper.writeValueAsString(input)!!
    }
}
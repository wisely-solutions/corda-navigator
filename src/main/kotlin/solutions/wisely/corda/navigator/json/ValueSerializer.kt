package solutions.wisely.corda.navigator.json

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer

abstract class ValueSerializer<T>(type: Class<T>) : StdSerializer<T>(type) {
    abstract fun writeValue (value: T, gen: JsonGenerator)
    override fun serialize(value: T?, gen: JsonGenerator?, provider: SerializerProvider?) {
        if (value == null) {
            gen!!.writeNull()
        } else {
            this.writeValue(value, gen!!)
        }
    }
}
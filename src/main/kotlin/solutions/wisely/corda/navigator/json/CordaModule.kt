package solutions.wisely.corda.navigator.json

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.Version
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import java.security.PublicKey
import net.corda.core.contracts.StateRef
import net.corda.core.identity.CordaX500Name
import org.apache.commons.codec.binary.Base64

class CordaModule : SimpleModule("CordaModule", Version.unknownVersion()) {
    init {
        addSerializer(PublicKey::class.java, PublicKeySerializer())
        addSerializer(StateRef::class.java, StateRefSerializer())
        addSerializer(CordaX500Name::class.java, CordaX500NameSerializer())
    }

    class PublicKeySerializer : StdSerializer<PublicKey>(PublicKey::class.java) {
        override fun serialize(value: PublicKey?, gen: JsonGenerator?, serializers: SerializerProvider?) {
            if (value != null) {
                gen!!.writeString(Base64.encodeBase64String(value.encoded))
            } else {
                gen!!.writeNull()
            }
        }
    }

    class StateRefSerializer : StdSerializer<StateRef>(StateRef::class.java) {
        override fun serialize(value: StateRef?, gen: JsonGenerator?, provider: SerializerProvider?) {
            if (value != null) {
                gen!!.writeString(value.toString())
            } else {
                gen!!.writeNull()
            }
        }
    }

    class CordaX500NameSerializer : StdSerializer<CordaX500Name>(CordaX500Name::class.java) {
        override fun serialize(value: CordaX500Name?, gen: JsonGenerator?, provider: SerializerProvider?) {
            if (value != null) {
                gen!!.writeString(value.toString())
            } else {
                gen!!.writeNull()
            }
        }
    }
}
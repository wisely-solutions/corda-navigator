package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.ContentTransformationException
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import solutions.wisely.corda.navigator.config.ConfigService
import solutions.wisely.corda.navigator.config.NodeConfiguration

class NodeRegisterController (private val config: ConfigService) {
    suspend fun register (call: ApplicationCall) {
        val request = try {
            call.receive<RegisterNodeApi>()
        } catch (e: ContentTransformationException) {
            call.respond(HttpStatusCode.BadRequest, "Invalid data format")
            return
        }

        val nodeId = config.addNode(NodeConfiguration(
            name = request.name,
            host = request.host,
            port = request.port,
            username = request.username,
            password = request.password
        ))
        call.respond(mapOf("id" to nodeId))
    }
}

data class RegisterNodeApi(
    val name: String,
    val host: String,
    val port: Int,
    val username: String,
    val password: String
)
package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import solutions.wisely.corda.navigator.config.ConfigService

class NodeRemoveController(private val config: ConfigService) {
    suspend fun remove(call: ApplicationCall) {
        val nodeId = call.nodeId()
        config.removeNode(nodeId)
        call.respond(mapOf("id" to nodeId))
    }
}
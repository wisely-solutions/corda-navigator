package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import org.slf4j.LoggerFactory
import solutions.wisely.corda.navigator.config.ConfigService


class NodeListController(private val config: ConfigService) {
    companion object {
        private val logger = LoggerFactory.getLogger(NodeListController::class.java)!!
    }

    suspend fun list(call: ApplicationCall) {
        try {
            call.respond(config.getNodes().map { NodeInfo(it.name, it.host, it.port) })
        } catch (e: Exception) {
            logger.error("Failed to list RPC clients", e)
            call.respond(HttpStatusCode.InternalServerError, "Failed to list RPC clients")
        }
    }
}

data class NodeInfo (
    val name: String,
    val host: String,
    val port: Int
)
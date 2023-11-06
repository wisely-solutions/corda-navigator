package solutions.wisely.corda.navigator.web.controller

import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import solutions.wisely.corda.navigator.config.ConfigService
import solutions.wisely.corda.navigator.exceptions.EntityNotFoundException
import solutions.wisely.corda.navigator.rpc.RPCConnectionManager

class NodeNetworkController (
    private val configService: ConfigService,
    private val rpcConnectionManager: RPCConnectionManager
) {
    suspend fun view (call: ApplicationCall) {
        val nodeId = call.nodeId()
        val node = configService.findById(nodeId) ?: throw EntityNotFoundException.node(nodeId)

        val notaries = rpcConnectionManager.connect(node).proxy.networkParameters.notaries
            .map { it.identity.name }

        call.respond(NetworkMap(
            notaries.joinToString(",") { it.organisation },
            rpcConnectionManager.connect(node).proxy.networkMapSnapshot()
                .filter { nd -> notaries.none { nt -> nd.legalIdentities.first().name == nt } }
                .map { it.legalIdentities.first() }
                .map { it.name.organisation }
                .toList()
        ))
    }
}

data class NetworkMap (
    val notary: String,
    val nodes: List<String>
)
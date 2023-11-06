package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import java.security.PublicKey
import net.corda.core.contracts.Command
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.StateAndRef
import net.corda.core.contracts.StateRef
import net.corda.core.contracts.TimeWindow
import net.corda.core.crypto.TransactionSignature
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.transactions.SignedTransaction
import org.slf4j.LoggerFactory
import solutions.wisely.corda.navigator.config.ConfigService
import solutions.wisely.corda.navigator.rpc.RPCConnectionManager

class NodeTransactionsController (
    private val configService: ConfigService,
    private val rpcConnectionManager: RPCConnectionManager
) {
    companion object {
        private val logger = LoggerFactory.getLogger(NodeTransactionsController::class.java)!!
    }

    suspend fun get (call: ApplicationCall) {
        val nodeId = call.parameters["id"]
        if (nodeId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid node ID")
            return
        }
        val txId = call.parameters["txId"]
        if (txId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid tx ID")
            return
        }
        val node = configService.findById(nodeId)

        if (node == null) {
            call.respond(HttpStatusCode.NotFound, "Node not found")
            return
        }

        val rpcConnection = rpcConnectionManager.connect(node)

        val tx = rpcConnection.transactions.list.firstOrNull { it.id.toString() == txId }
            ?.let { toOutput(rpcConnection, it) }


        if (tx == null) {
            call.respond(HttpStatusCode.NotFound, mapOf("error" to "no transaction with id found"))
        } else {
            call.respond(HttpStatusCode.OK, tx)
        }

    }

    suspend fun list (call: ApplicationCall) {
        val nodeId = call.parameters["id"]
        if (nodeId == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid node ID")
            return
        }

        val node = configService.findById(nodeId)

        if (node == null) {
            call.respond(HttpStatusCode.NotFound, "Node not found")
            return
        }

        try {
            // Establish a connection to the Corda node
            val rpcConnection = rpcConnectionManager.connect(node)

            // It's crucial to close the connection after use to prevent resource leak
            val txList = rpcConnection.transactions.list
                .subList(0, 50)
                .map {
                    st ->
                    toOutput(rpcConnection, st)
                }


            // Respond with the list of transaction IDs
            call.respond(txList)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, "Error retrieving transactions")
        }
    }

    private fun toOutput(
        rpcConnection: RPCConnectionManager.CordaConnection,
        st: SignedTransaction
    ): SignedTransactionDto {
        val outputStateRefs = List(st.tx.outputs.size) { i -> StateRef(st.id, i) }
        val allStates = rpcConnection.proxy.vaultQueryBy<ContractState>(
            criteria = QueryCriteria.VaultQueryCriteria()
                .withStateRefs(
                    st.tx.inputs +
                            outputStateRefs +
                            st.references
                )
                .withStatus(Vault.StateStatus.ALL)
        )

        val statesInfo = allStates.states.zip(allStates.statesMetadata).map { StateInfo(it.first, it.second) }
        return SignedTransactionDto(
            id = st.tx.id.toString(),
            inputs = statesInfo.filter { st.tx.inputs.contains(it.stateAndRef.ref) },
            outputs = statesInfo.filter { outputStateRefs.contains(it.stateAndRef.ref) },
            references = statesInfo.filter { st.references.contains(it.stateAndRef.ref) },
            commands = st.tx.commands,
            signatures = st.sigs,
            requiredSigningKeys = st.requiredSigningKeys,
            timeWindow = st.tx.timeWindow,
        )
    }
}

data class StateInfo (
    val stateAndRef: StateAndRef<ContractState>,
    val metadata: Vault.StateMetadata
)

data class SignedTransactionDto(
    val id: String,
    val inputs: List<StateInfo>,
    val outputs: List<StateInfo>,
    val references: List<StateInfo>,
    val commands: List<Command<*>>,
    val signatures: List<TransactionSignature>,
    val requiredSigningKeys: Set<PublicKey>,
    val timeWindow: TimeWindow?
)
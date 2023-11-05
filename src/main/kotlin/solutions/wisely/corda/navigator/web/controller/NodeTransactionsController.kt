package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import java.time.Instant
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
            val proxy = rpcConnection.proxy

            // Fetching the transactions from the node
            @Suppress("DEPRECATION") val transactions = proxy.internalVerifiedTransactionsSnapshot()
            val txList = transactions.map { it.toDTO() } // Simplified for this example

            // It's crucial to close the connection after use to prevent resource leak
            rpcConnection.notifyServerAndClose()

            // Respond with the list of transaction IDs
            call.respond(txList)
        } catch (e: Exception) {
            call.respond(HttpStatusCode.InternalServerError, "Error retrieving transactions")
        }
    }
}

data class SignedTransactionDTO(
    val id: String,
    val inputs: List<StateRefDTO>,
    val outputs: List<ContractStateDTO>,
    val commandDataTypes: List<String>,
    val signers: List<String>,
    val timeWindowFrom: Instant?,
    val timeWindowUntil: Instant?
)

data class ContractStateDTO(
    val participants: List<PartyDTO>,
    // Add other properties of ContractState you want to expose
)

data class PartyDTO (
    val name: String
)

data class StateRefDTO (
    val hash: String,
    val index: Int
)

fun SignedTransaction.toDTO(): SignedTransactionDTO {
    return SignedTransactionDTO(
        id = this.id.toString(),
        inputs = this.tx.inputs.map { StateRefDTO(it.txhash.toString(), it.index) },
        outputs = this.tx.outputs.map { output ->
            ContractStateDTO(
                participants = output.data.participants.map { PartyDTO(it.nameOrNull()?.toString()?:"unknown") }
                // Map other needed properties here
            )
        },
        commandDataTypes = this.tx.commands.map { it.value.javaClass.simpleName },
        signers = this.sigs.map { it.by.toString() },
        timeWindowFrom = this.tx.timeWindow?.fromTime,
        timeWindowUntil = this.tx.timeWindow?.untilTime
    )
}
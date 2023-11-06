package solutions.wisely.corda.navigator.rpc

import net.corda.client.rpc.CordaRPCClient
import net.corda.client.rpc.CordaRPCConnection
import net.corda.core.contracts.ContractState
import net.corda.core.messaging.CordaRPCOps
import net.corda.core.messaging.vaultTrackBy
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.utilities.NetworkHostAndPort
import solutions.wisely.corda.navigator.config.NodeConfiguration

class RPCConnectionManager {
    private val connection : MutableMap<String, CordaConnection> = mutableMapOf()

    fun connect(node: NodeConfiguration): CordaConnection {
        if (!connection.containsKey(node.name)) {
            val rpcAddress = NetworkHostAndPort(node.host, node.port)
            val rpcClient = CordaRPCClient(rpcAddress)
            val rpcConnection = rpcClient.start(node.username, node.password)
            connection[node.name] = CordaConnection(
                rpcConnection,
                transactions = TransactionTracker(rpcConnection)
            )

        }

        return connection[node.name]!!
    }

    data class CordaConnection (
        val rpc: CordaRPCConnection,
        val transactions: TransactionTracker
    ) {
        val proxy : CordaRPCOps
            get () = rpc.proxy
    }
}
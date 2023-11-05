package solutions.wisely.corda.navigator.rpc

import net.corda.client.rpc.CordaRPCClient
import net.corda.client.rpc.CordaRPCConnection
import net.corda.core.contracts.ContractState
import net.corda.core.messaging.vaultTrackBy
import net.corda.core.utilities.NetworkHostAndPort
import solutions.wisely.corda.navigator.config.NodeConfiguration

class RPCConnectionManager {
    private val connection : MutableMap<String, CordaRPCConnection> = mutableMapOf()

    fun connect(node: NodeConfiguration): CordaRPCConnection {
        if (!connection.containsKey(node.name)) {
            val rpcAddress = NetworkHostAndPort(node.host, node.port)
            val rpcClient = CordaRPCClient(rpcAddress)
            val rpcConnection = rpcClient.start(node.username, node.password)
            connection[node.name] = rpcConnection
        }

        return connection[node.name]!!
    }

}
package solutions.wisely.corda.navigator.rpc

import net.corda.client.rpc.CordaRPCConnection
import net.corda.core.contracts.StateRef
import net.corda.core.transactions.SignedTransaction

class TransactionTracker(connection: CordaRPCConnection) {

    private val transactions = mutableListOf<SignedTransaction>()

    init {
        val feed = connection.proxy.internalVerifiedTransactionsFeed()
        feed.snapshot.forEach {
            transactions.add(it)
        }
        feed.updates.subscribe {
            transactions.add(it)
        }
    }

    val list : List<SignedTransaction>
        get () = transactions.toList()

    fun findFromInput(ref: StateRef): List<SignedTransaction> {
        return list.filter { it.inputs.contains(ref) }
    }

    fun findFromReference(ref: StateRef): List<SignedTransaction> {
        return list.filter { it.references.contains(ref) }
    }
}
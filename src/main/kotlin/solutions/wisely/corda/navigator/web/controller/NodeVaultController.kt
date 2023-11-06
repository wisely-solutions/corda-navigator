package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.StateAndRef
import net.corda.core.contracts.StateRef
import net.corda.core.contracts.TransactionState
import net.corda.core.crypto.SecureHash
import net.corda.core.internal.isAbstractClass
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.PageSpecification
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.node.services.vault.Sort
import net.corda.core.node.services.vault.SortAttribute
import org.reflections.Reflections
import org.reflections.scanners.Scanners
import org.reflections.util.ClasspathHelper
import org.reflections.util.ConfigurationBuilder
import org.slf4j.LoggerFactory
import solutions.wisely.corda.navigator.classpath.JarLoader.urls
import solutions.wisely.corda.navigator.config.ConfigService
import solutions.wisely.corda.navigator.exceptions.EntityNotFoundException
import solutions.wisely.corda.navigator.rpc.RPCConnectionManager

class NodeVaultController(
    private val configService: ConfigService,
    private val rpcConnectionManager: RPCConnectionManager
) {


    private val reflections: Reflections by lazy {
        Reflections(
            ConfigurationBuilder()
                .setUrls(ClasspathHelper.forJavaClassPath() + urls())
                .addClassLoaders(ClassLoader.getSystemClassLoader())
                .setScanners(Scanners.SubTypes)
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(NodeVaultController::class.java)!!
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
        val index = call.parameters["index"]
        if (index == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid index")
            return
        }

        val node = configService.findById(nodeId)

        if (node == null) {
            call.respond(HttpStatusCode.NotFound, "Node not found")
            return
        }


        val cordaConnection = rpcConnectionManager.connect(node)
        val proxy = cordaConnection.proxy
        val queryResult = proxy.vaultQueryBy(
            QueryCriteria.VaultQueryCriteria()
                .withStateRefs(listOf(StateRef(SecureHash.parse(txId), index.toInt())))
                .withStatus(Vault.StateStatus.ALL),
            PageSpecification(),
            Sort(
                setOf(
                    Sort.SortColumn(
                        SortAttribute.Standard(Sort.VaultStateAttribute.RECORDED_TIME),
                        direction = Sort.Direction.DESC
                    )
                )
            ),
            ContractState::class.java
        )


        call.respond(queryResult.states.zip(queryResult.statesMetadata).map {
            ExtendedStateInfo(
                it.first,
                it.second,
                cordaConnection.transactions.findFromInput(it.first.ref)
                    .map { r -> TxReference("input", r.id.toString()) }
                +
                        cordaConnection.transactions.findFromReference(it.first.ref)
                            .map { r -> TxReference("reference", r.id.toString()) }
            )
        }.first())
    }

    suspend fun search(call: ApplicationCall) {
        val nodeId = call.nodeId()
        val pageRequest = call.pagination()

        val node = configService.findById(nodeId) ?: throw EntityNotFoundException.node(nodeId)

        try {
            // Get or create the RPC connection
            val proxy = rpcConnectionManager.connect(node).proxy

            // Fetching the states from the node's vault
            val paging = PageSpecification(
                pageRequest.page,
                pageRequest.pageSize
            )

            val stateTypesFilter = call.request.queryParameters.getAll("stateType")?.toSet()?.map {
                Class.forName(it) as Class<out ContractState>
            }?.toSet() ?: setOf()

            val queryResult = proxy.vaultQueryBy(
                QueryCriteria.VaultQueryCriteria()
                    .withContractStateTypes(stateTypesFilter)
                    .withStatus(Vault.StateStatus.ALL),
                paging,
                Sort(
                    setOf(
                        Sort.SortColumn(
                            SortAttribute.Standard(Sort.VaultStateAttribute.RECORDED_TIME),
                            direction = Sort.Direction.DESC
                        )
                    )
                ),
                ContractState::class.java
            )

            // Respond with the list of states

            call.respond(ResultPage(
                Pagination(
                    queryResult.totalStatesAvailable,
                    paging.pageNumber,
                    paging.pageSize
                ),
                queryResult.states.zip(queryResult.statesMetadata).map {
                    StateInfo(
                        it.first,
                        it.second
                    )
                }
            ))
        } catch (e: Exception) {
            logger.error("Failed to list vault states", e)
            call.respond(HttpStatusCode.InternalServerError, "Error retrieving vault states")
        }
    }

    suspend fun possibleStateTypes(call: ApplicationCall) {
        val subTypesOf = reflections.getSubTypesOf(ContractState::class.java)
        call.respond(
            HttpStatusCode.OK,
            subTypesOf
                .filter { !it.isAnonymousClass }
                .filter { !it.isAbstractClass }
                .filter { !it.isInterface }
                .map { it.name }.sorted()
        )
    }
}



data class ExtendedStateInfo (
    val stateAndRef: StateAndRef<ContractState>,
    val metadata: Vault.StateMetadata,
    val transactions: List<TxReference>
)

data class TxReference (
    val type: String,
    val id: String
)
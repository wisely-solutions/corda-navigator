package solutions.wisely.corda.navigator.web.controller

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import net.corda.core.contracts.ContractState
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

    suspend fun search(call: ApplicationCall) {
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
            // Get or create the RPC connection
            val proxy = rpcConnectionManager.connect(node).proxy

            // Fetching the states from the node's vault
            val paging = PageSpecification()

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
                paging.pageNumber,
                paging.pageSize,
                queryResult.totalStatesAvailable,
                queryResult.states.zip(queryResult.statesMetadata).map {
                    VaultItem(
                        it.first.state,
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

data class ResultPage<T>(
    val page: Int,
    val pageSize: Int,
    val total: Long,
    val items: List<T>
)

data class VaultItem(
    val data: Any,
    val metadata: Vault.StateMetadata
)
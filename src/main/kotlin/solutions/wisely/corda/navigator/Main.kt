package solutions.wisely.corda.navigator

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.http.content.static
import io.ktor.server.http.content.staticFiles
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import java.io.File
import solutions.wisely.corda.navigator.classpath.JarLoader
import solutions.wisely.corda.navigator.config.ConfigService
import solutions.wisely.corda.navigator.json.CordaModule
import solutions.wisely.corda.navigator.json.DateModule
import solutions.wisely.corda.navigator.rpc.RPCConnectionManager
import solutions.wisely.corda.navigator.web.ExceptionHandlers.install
import solutions.wisely.corda.navigator.web.controller.NodeListController
import solutions.wisely.corda.navigator.web.controller.NodeRegisterController
import solutions.wisely.corda.navigator.web.controller.NodeRemoveController
import solutions.wisely.corda.navigator.web.controller.NodeTransactionsController
import solutions.wisely.corda.navigator.web.controller.NodeVaultController

fun main() {
    val port = System.getProperty("PORT")?.ifBlank { null }?.toInt() ?: 8083
    embeddedServer(Netty, port = port, host = "0.0.0.0") {
        mainModule()
    }.start(wait = true)
}

private fun Application.mainModule() {
    JarLoader.load()

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            setSerializationInclusion(JsonInclude.Include.NON_NULL)
            registerModule(DateModule())
            registerModule(CordaModule())
        }
    }

    val rpcConnectionManager = RPCConnectionManager()

    val configService = ConfigService()
    val registerController = NodeRegisterController(configService)
    val removeController = NodeRemoveController(configService)
    val listController = NodeListController(configService)
    val transactionsController = NodeTransactionsController(configService, rpcConnectionManager)
    val vaultController = NodeVaultController(configService, rpcConnectionManager)

    val staticFilesLocation = File(System.getProperty("ROOT_DIR")?.ifEmpty { null } ?: "public")

    routing {
        staticFiles("/", staticFilesLocation)

        route("/api") {
            route("/filter") {
                get("/states") { vaultController.possibleStateTypes(this.context) }
            }
            route("/node") {
                post("/register") { registerController.register(this.context) }
                get("/list") { listController.list(this.context) }

                route("/{id}") {
                    delete { removeController.remove(this.context) }
                    route("/transaction") {
                        get("/list") { transactionsController.list(this.context) }
                        get("/{txId}") { transactionsController.get(this.context) }
                    }
                    route("/state") {
                        get("/{txId}/{index}") { vaultController.get(this.context) }
                    }
                    get("/states") { vaultController.search(this.context) }
                }
            }
        }


    }

    install(this, staticFilesLocation)
}

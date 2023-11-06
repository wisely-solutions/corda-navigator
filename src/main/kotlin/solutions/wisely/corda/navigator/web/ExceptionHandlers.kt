package solutions.wisely.corda.navigator.web

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.plugins.statuspages.statusFile
import io.ktor.server.response.respond
import io.ktor.server.response.respondFile
import io.ktor.server.response.respondText
import io.micrometer.core.instrument.binder.jetty.JettyClientTags.status
import java.io.File
import java.sql.SQLException
import org.slf4j.LoggerFactory

object ExceptionHandlers {
    private val logger = LoggerFactory.getLogger(ExceptionHandlers::class.java)
    fun install (app: Application, path: File) {
        val indexFile = File(path, "index.html")
        app.install(StatusPages) {
            status(HttpStatusCode.NotFound) { call, _ ->
                if (indexFile.exists()) {
                    call.respondFile(indexFile)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
            exception<Throwable> { call, cause ->
                logger.error("Unhandled exception caught", cause)
                call.respondText(
                    text = "An unexpected error occurred: ${cause.localizedMessage}",
                    status = HttpStatusCode.InternalServerError
                )
            }
            exception<SQLException> { call, cause ->
                call.respond(HttpStatusCode.ServiceUnavailable, "Database error: ${cause.localizedMessage}")
            }
            // You can add more exception handlers here
        }
    }
}
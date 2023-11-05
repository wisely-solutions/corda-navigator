package solutions.wisely.corda.navigator.web

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import java.sql.SQLException
import org.slf4j.LoggerFactory

object ExceptionHandlers {
    private val logger = LoggerFactory.getLogger(ExceptionHandlers::class.java)
    fun install (app: Application) {
        app.install(StatusPages) {
            exception<Throwable> { call, cause ->
                logger.error("Unhandled exception caught", cause)
                call.respondText(
                    text = "An unexpected error occurred: ${cause.localizedMessage}",
                    status = io.ktor.http.HttpStatusCode.InternalServerError
                )
            }
            exception<SQLException> { call, cause ->
                call.respond(io.ktor.http.HttpStatusCode.ServiceUnavailable, "Database error: ${cause.localizedMessage}")
            }
            // You can add more exception handlers here
        }
    }
}
package solutions.wisely.corda.navigator.web.controller

import io.ktor.server.application.ApplicationCall
import solutions.wisely.corda.navigator.exceptions.MissingParameterException

fun ApplicationCall.nodeId(): String {
    return parameters["id"] ?: throw MissingParameterException("id")
}
fun ApplicationCall.transactionId(): String {
    return parameters["txId"] ?: throw MissingParameterException("txId")
}

fun ApplicationCall.pagination () : PageRequest {
    val page = this.parameters["page"]?.toInt() ?: 1
    val pageItems = this.parameters["pageItems"]?.toInt() ?: 20

    return PageRequest(page, pageItems)
}
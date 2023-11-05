package solutions.wisely.corda.navigator.config

data class NodeConfiguration (
    val name: String,
    val host: String,
    val port: Int,
    val username: String,
    val password: String
)
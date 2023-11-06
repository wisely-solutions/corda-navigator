package solutions.wisely.corda.navigator.exceptions


class MissingParameterException (param: String) : Exception("Missing parameter '${param}'")
class EntityNotFoundException (entity: String, eRef: String) : Exception("$entity with id '${eRef}' not found") {
    companion object {
        fun node (nodeId: String): EntityNotFoundException {
            return EntityNotFoundException("Node", nodeId)
        }
        fun transaction (nodeId: String): EntityNotFoundException {
            return EntityNotFoundException("Transaction", nodeId)
        }
    }
}
package solutions.wisely.corda.navigator.config

class ConfigService {
    private var config = ConfigLoader.load()

    fun getNodes () : List<NodeConfiguration> {
        return config.nodes
    }

    fun addNode (node: NodeConfiguration) {
        if (this.config.nodes.any { it.name == node.name }) {
            throw NodeAlreadyExistsException(node.name)
        }

        this.config = this.config.copy(
            nodes = config.nodes + node
        )

        ConfigLoader.save(config)
    }

    fun findById(nodeId: String): NodeConfiguration? {
        return this.config.nodes.firstOrNull { it.name == nodeId }
    }

    fun removeNode(nodeId: String) {
        this.config = this.config.copy(
            nodes = config.nodes.filter { it.name != nodeId }
        )
        ConfigLoader.save(this.config)
    }
}
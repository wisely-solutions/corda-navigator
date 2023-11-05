import {makeAutoObservable} from "mobx";


class Nodes {
    nodes = [];
    constructor() {
        makeAutoObservable(this);
    }

    addNode(node) {
        let found = this.nodes.find(it => it.name === node.name)
        if (found) {
            // nothing!
        } else {
            this.nodes.push(node)
        }
    }

    removeNode (nodeId) {
        this.nodes = this.nodes.filter(it => it.name !== nodeId)
    }

    load (list) {
        list.forEach(it => this.addNode(it))
    }

    get (name) {
        return this.nodes.find(it => it.name === name)
    }

    get isEmpty () {
        return this.nodes.length === 0
    }
}

const nodesStore = new Nodes();
export default nodesStore;

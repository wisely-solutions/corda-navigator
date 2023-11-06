import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {fetchNetwork} from "../../../services/RpcService";
import Loading from "../../ux/loading/Loading";
import Graph from 'react-vis-network-graph';

const NetworkDiagram = ({ nodes, edges }) => {
    // Define graph options (customize as needed)
    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        height: "500px"
    };

    // Define graph events (customize as needed)
    const events = {
        select: function(event) {
            const { nodes, edges } = event;
            console.log("Selected nodes:");
            console.log(nodes);
            console.log("Selected edges:");
            console.log(edges);
        }
    };

    return <Graph graph={{ nodes, edges }} options={options} events={events} />;
};

const NetworkView = () => {
    const { nodeId } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [network, setNetwork] = useState([])

    useEffect(() => {
        // Fetch the list of existing RPC clients
        fetchNetwork(nodeId)
            .then(r => {
                setNetwork(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching transaction:', e);
                alert('Failed to load transaction.');
            })
    }, [nodeId]);

    if (!loaded) {
        return (
            <Loading />
        )
    }


    const nodes = [
        { id: 1, label: network.notary, title: network.notary, color: "#ffcc00" }
        // ... other nodes
    ];
    let edges = []

    network.nodes.forEach((it, i) => {
        if (!nodes.find(it => it.id === (i+2))) {
            nodes.push({id: i + 2, label: it, title: it})
            edges.push({id: `1_${i+2}`, from: 1, to: i + 2})
        }
    })

    console.log(nodes)
    console.log(edges)

    return (
        <div className="text-center">
            <NetworkDiagram nodes={nodes} edges={edges} />
        </div>
    );
}
export default NetworkView;
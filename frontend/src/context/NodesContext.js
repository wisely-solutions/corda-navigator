import React, {useEffect, useState} from "react";
import {fetchNodes} from "../services/RpcService";
import VerticalCenterLoading from "../components/ux/loading/VerticalCenterLoading";
import {useStores} from "../store";

const NodesContext = ({children}) => {
    const [loaded, setLoaded] = useState(false)
    let { nodesStore } = useStores()

    useEffect(() => {
        // Fetch the list of existing RPC clients
        fetchNodes()
            .then(r => {
                nodesStore.load(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching nodes:', e);
                alert('Failed to load nodes.');
            })
    }, []);

    if (!loaded) {
        return (<VerticalCenterLoading />)
    }

    return children;
}
export default NodesContext;
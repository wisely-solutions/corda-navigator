import React, {useEffect, useState} from "react";
import {fetchStates} from "../../services/RpcService";
import Loading from "../ux/loading/Loading";
import {Badge} from "react-bootstrap";
import {StateDetail} from "./StateDetail";
import {useNavigate, useParams} from "react-router-dom";

export const StatesTable = ({name, filters}) => {
    const [loaded, setLoaded] = useState(false)
    const [stateResult, setStateResult] = useState([]);

    useEffect(() => {
        setLoaded(false)
        fetchStates(name, filters)
            .then(r => {
                setStateResult(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching states:', e);
            })
    }, [name, filters]);


    if (!loaded) {
        return <Loading/>
    }

    return (
        <div className="table-responsive small">
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Recorded</th>
                    <th scope="col">Consumed</th>
                    <th scope="col">Status</th>
                    <th scope="col">Relevancy</th>
                </tr>
                </thead>
                <tbody>
                {stateResult.items.map((state, index) => (
                    <StateRow state={state} key={index}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}


const StateRow = ({state}) => {
    let { nodeId } = useParams()
    let navigate = useNavigate()
    let bgFromStatus = (status) => {
        if (status === "UNCONSUMED") return "success"
        return "secondary"
    }
    let bgFromRelevancy = (status) => {
        if (status === "RELEVANT") return "primary"
        return "secondary"
    }

    let shortName = (className) => {
        return className.split(".").pop()
    }

    return (
        <>
            <tr onClick={() => navigate(`/node/${nodeId}/state/${state.metadata.ref.tx}/${state.metadata.ref.index}`)} style={{cursor: "pointer"}}>
                <td><code>{shortName(state.metadata.contractStateClassName)}</code></td>
                <td>{state.metadata.recordedTime}</td>
                <td>
                    {state.metadata.consumedTime && state.metadata.consumedTime}
                    {!state.metadata.consumedTime && <span>---</span>}
                </td>
                <td><Badge bg={bgFromStatus(state.metadata.status)}>{state.metadata.status}</Badge></td>
                <td><Badge bg={bgFromRelevancy(state.metadata.relevancyStatus)}>{state.metadata.relevancyStatus}</Badge></td>
                {/* Render other state properties as needed */}
            </tr>
        </>
    )
}
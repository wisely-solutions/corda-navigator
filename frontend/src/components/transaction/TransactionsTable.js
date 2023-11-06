import React, {useEffect, useState} from "react";
import {fetchStates, fetchTransactions} from "../../services/RpcService";
import Loading from "../ux/loading/Loading";
import PaginationComponent from "../pagination/Pagination";
import {useNavigate, useParams} from "react-router-dom";
import {Badge, Card} from "react-bootstrap";

export const TransactionTable = ({name, filters, itemsPerPage}) => {
    const [loaded, setLoaded] = useState(false)
    const [queryResult, setQueryResult] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoaded(false)
        fetchTransactions(name, filters, {
            itemsPerPage: itemsPerPage,
            page: page,
        })
            .then(r => {
                setQueryResult(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching states:', e);
            })
    }, [name, filters, itemsPerPage, page]);


    if (!loaded) {
        return <Loading/>
    }

    return (
        <div className="table-responsive small">
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th>Command</th>
                    <th>Timestamp</th>
                    <th>Inputs</th>
                    <th>Outputs</th>
                    <th>References</th>
                </tr>
                </thead>
                <tbody>
                {queryResult.items.map((item, index) => (
                    <StateRow item={item} key={index}/>
                ))}
                </tbody>
            </table>
            <PaginationComponent pagination={queryResult.pagination} onPageChange={p => setPage(p)}/>
        </div>
    )
}


const StateRow = ({item}) => {
    let {nodeId} = useParams()
    let navigate = useNavigate()

    let shortName = (className) => {
        return className.split(/[\\.$]/).pop()
    }

    let command = (item) => {
        return item.commands.map((it) => shortName(it.value)).join(",")
    }

    let timestamp = (item) => {
        if (item.inputs.length > 0) return item.inputs[0].metadata.consumedTime
        else if (item.outputs.length > 0) return item.outputs[0].metadata.recordedTime
        else return "---"
    }

    return (
        <>
            <tr onClick={() => navigate(`/node/${nodeId}/transaction/${item.id}`)}
                style={{cursor: "pointer"}}>
                <td><code>{item.id}</code></td>
                <td>{command(item)}</td>
                <td>{timestamp(item)}</td>
                <td>{item.inputs.length}</td>
                <td>{item.outputs.length}</td>
                <td>{item.references.length}</td>
            </tr>

        </>
    )
}
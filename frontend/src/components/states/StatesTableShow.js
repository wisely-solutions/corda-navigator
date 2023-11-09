import {useNavigate, useParams} from "react-router-dom";
import {Badge, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import React from "react";
import PaginationComponent from "../pagination/Pagination";


export const StatesTableShow = ({stateResult: queryResult}) => {
    return (
        <div className="table-responsive small">
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Type</th>
                    <th scope="col">Recorded</th>
                    <th scope="col">Labels</th>
                </tr>
                </thead>
                <tbody>
                {queryResult.items.map((item, index) => (
                    <StateRow item={item} key={index}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

const StateRow = ({item}) => {
    let {nodeId} = useParams()
    let navigate = useNavigate()

    let shortName = (className) => {
        return className.split(".").pop()
    }

    return (
        <>
            <tr>
                <td>
                    <OverlayTrigger overlay={<Tooltip>{item.metadata.ref.tx}/{item.metadata.ref.index}</Tooltip>}>
                        <a className="link" style={{cursor: "pointer"}}
                           onClick={() => navigate(`/node/${nodeId}/state/${item.metadata.ref.tx}/${item.metadata.ref.index}`)}
                        >
                            {item.metadata.ref.tx.substring(0, 6)}/{item.metadata.ref.index}
                        </a>
                    </OverlayTrigger>
                </td>
                <td><code>{shortName(item.metadata.contractStateClassName)}</code></td>
                <td>{item.metadata.recordedTime}</td>
                <td>
                    <Row>
                        <Col><ConsumedTimeLabel item={item}/></Col>
                        <Col><RelevancyLabel item={item}/></Col>
                        <Col><LinearIdLabel item={item}/></Col>
                    </Row>

                    <span> </span>
                    <RelevancyLabel item={item}/>
                    <span> </span>

                </td>
                {/* Render other state properties as needed */}
            </tr>
        </>
    )
}

const LinearIdLabel = ({item}) => {
    let navigate = useNavigate()
    let { nodeId } = useParams()
    if (!item.stateAndRef.state.data.linearId?.id) {
        return <></>
    }
    return (
        <OverlayTrigger overlay={<Tooltip>{item.stateAndRef.state.data.linearId.id}</Tooltip>}>
            <Badge style={{cursor: "pointer"}} onClick={() => navigate(`/node/${nodeId}/states/linear/${item.stateAndRef.state.data.linearId.id}`)} bg="warning">LINEAR ID</Badge>
        </OverlayTrigger>
    )
}

const ConsumedTimeLabel = ({item}) => {
    let bgFromStatus = (status) => {
        if (status === "UNCONSUMED") return "success"
        return "secondary"
    }

    if (item.metadata.consumedTime) {
        return (
            <OverlayTrigger overlay={<Tooltip>{item.metadata.consumedTime}</Tooltip>}><Badge
                bg={bgFromStatus(item.metadata.status)}> {item.metadata.status} </Badge></OverlayTrigger>
        )
    }
    return (
        <Badge bg={bgFromStatus(item.metadata.status)}>{item.metadata.status}</Badge>
    )
}

const RelevancyLabel = ({item}) => {
    let bgFromRelevancy = (status) => {
        if (status === "RELEVANT") return "primary"
        return "secondary"
    }

    return (
        <Badge bg={bgFromRelevancy(item.metadata.relevancyStatus)}>{item.metadata.relevancyStatus}</Badge>
    )
}
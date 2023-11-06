import {Col, Row, Table} from "react-bootstrap";
import React from "react";
import {Link, useParams} from "react-router-dom";

export const StateDetail = ({state}) => {
    let { nodeId } = useParams();

    return (
        <>
            <Row>
                <Col>
                    <dl>
                        <dt>Transaction</dt>
                        <dd><code>{state.metadata.ref.tx}</code></dd>
                        <dt>Transaction Index</dt>
                        <dd>{state.metadata.ref.index}</dd>
                        <dt>Contract</dt>
                        <dd style={{margin: "0px"}}><code>{state.stateAndRef.state.contract}</code></dd>
                    </dl>
                </Col>
                <Col>
                    <dl>
                        <dt>Notary</dt>
                        <dd>{state.metadata.notary.name}</dd>
                        <dt>Recorded</dt>
                        <dd style={{margin: "0px"}}>
                            {state.metadata.recordedTime}
                        </dd>
                        <dt>Consumed</dt>
                        <dd style={{margin: "0px"}}>
                            {state.metadata.consumedTime && state.metadata.consumedTime}
                            {!state.metadata.consumedTime && "---"}
                        </dd>
                    </dl>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{display: "grid"}}>
                    <code style={{
                        display: "grid",
                        overflow: "auto",
                        maxWidth: "100%",
                        padding: "20px",
                        backgroundColor: "#fff"
                    }}><pre>{JSON.stringify(state.stateAndRef.state.data, null, 2)}</pre></code>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>Referenced in Transactions</h5>

                    <Table>
                        <thead>
                        <th>Type</th>
                        <th>Transaction</th>
                        </thead>
                        <tbody>
                        <tr>
                            <td>output</td>
                            <td><Link to={`/node/${nodeId}/transaction/${state.metadata.ref.tx}`}>{state.metadata.ref.tx}</Link></td>
                        </tr>
                        {state.transactions.map((it, i) => <tr key={i}>
                            <td>{it.type}</td>
                            <td><Link to={`/node/${nodeId}/transaction/${it.id}`}>{it.id}</Link></td>
                        </tr>)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}
import {Col, Row} from "react-bootstrap";
import React from "react";
import {Link, useParams} from "react-router-dom";

export const StateDetail = ({state}) => {
    let { nodeId } = useParams();

    return (
        <tr>
            <td colSpan={5} style={{padding: "0px"}}>
                <Row style={{backgroundColor: "#eee", padding: "10px"}}>
                    <Col>
                        <dl style={{margin: "0px"}}>
                            <dt>Reference</dt>
                            <dd><Link to={`/node/${nodeId}/transaction/${state.metadata.ref.tx}`}>{state.metadata.ref.tx}</Link> (index: {state.metadata.ref.index})</dd>
                            <dt>Contract</dt>
                            <dd style={{margin: "0px"}}><code>{state.data.contract}</code></dd>
                        </dl>
                    </Col>
                    <Col>
                        <dl style={{margin: "0px"}}>
                            <dt>Notary</dt>
                            <dd>{state.metadata.notary.name}</dd>
                            <dt>Consumed</dt>
                            <dd style={{margin: "0px"}}>
                                {state.metadata.consumedTime && state.metadata.consumedTime}
                                {!state.metadata.consumedTime && "---"}
                            </dd>
                        </dl>
                    </Col>
                </Row>
                <div style={{display: "grid"}}>
                    <pre style={{
                        display: "grid",
                        overflow: "auto",
                        maxWidth: "100%",
                        padding: "20px",
                        backgroundColor: "#bbb"
                    }}>{JSON.stringify(state.data.data, null, 2)}</pre>
                </div>
            </td>
        </tr>
    )
}
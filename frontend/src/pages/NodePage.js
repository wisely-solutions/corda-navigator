import React from "react";
import NodeTransactions from "../components/NodeTransactions";
import {useParams} from "react-router-dom";
import NodeStates from "../components/NodeStates";
import BasePage from "./layout/BasePage";
import {Col, Container, Row} from "react-bootstrap";
import {useStores} from "../store";
import NodesContext from "../context/NodesContext";

const NodePage = () => {
    let params = useParams();
    let {nodesStore} = useStores()

    let node = nodesStore.get(params.name)

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <p className="lead">{node.name} <small>: Connected via RPC on {node.host}:{node.port}</small>
                        </p>
                    </Col>
                </Row>
                {/*<Row>*/}
                {/*    <Col>*/}
                {/*        <h2>Transactions</h2>*/}
                {/*        <NodeTransactions name={params.name}/>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row>
                    <Col>
                        <h2>States</h2>
                        <NodeStates name={params.name}/>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}

export default NodePage;
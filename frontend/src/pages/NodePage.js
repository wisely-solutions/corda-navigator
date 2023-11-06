import React from "react";
import {useParams} from "react-router-dom";
import BasePage from "./layout/BasePage";
import {Col, Container, Row} from "react-bootstrap";
import {useStores} from "../store";
import NetworkView from "../components/node/network/NetworkView";

const NodePage = () => {
    let {nodeId} = useParams();
    let {nodesStore} = useStores()

    let node = nodesStore.get(nodeId)

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <p className="lead">{node.name} <small>: Connected via RPC on {node.host}:{node.port}</small>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Network</h2>
                        <NetworkView />
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}

export default NodePage;
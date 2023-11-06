import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {fetchState, fetchTransaction} from "../services/RpcService";
import BasePage from "./layout/BasePage";
import Loading from "../components/ux/loading/Loading";
import {Card, Col, Container, Row, Table} from "react-bootstrap";
import {StateDetail} from "../components/states/StateDetail";

const StatePage = () => {
    const { nodeId, txId, outputIndex } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [contractState, setContractState] = useState(null)

    useEffect(() => {
        // Fetch the list of existing RPC clients
        fetchState(nodeId, txId, outputIndex)
            .then(r => {
                setContractState(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching contractState:', e);
                alert('Failed to load contractState.');
            })
    }, [nodeId, txId]);

    if (!loaded) {
        return (
            <BasePage>
                <Loading />
            </BasePage>
        )
    }

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <Card.Header>

                            </Card.Header>
                            <Card.Body>
                                <StateDetail state={contractState} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}
export default StatePage;
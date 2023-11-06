import React, {useEffect, useState} from "react";
import {fetchTransaction} from "../services/RpcService";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/ux/loading/Loading";
import BasePage from "./layout/BasePage";
import {Card, Col, Container, Row, Table} from "react-bootstrap";

const StateRow = ({type, state}) => {
    let { nodeId } = useParams()
    let navigate = useNavigate()
    return (
        <tr style={{cursor: "pointer"}} onClick={() => navigate(`/node/${nodeId}/state/${state.metadata.ref.tx}/${state.metadata.ref.index}`)}>
            <td>{type}</td>
            <td>{state.metadata.contractStateClassName}</td>
        </tr>
    )
}

const TransactionPage = () => {
    const { nodeId, txId } = useParams()
    const [loaded, setLoaded] = useState(false)
    const [transaction, setTransaction] = useState(null)

    useEffect(() => {
        // Fetch the list of existing RPC clients
        fetchTransaction(nodeId, txId)
            .then(r => {
                setTransaction(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching transaction:', e);
                alert('Failed to load transaction.');
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
                                Transaction: <code>{transaction.id}</code>
                            </Card.Header>
                            <Card.Body>
                                <h4>Details</h4>
                                <Card.Text>
                                    Timestamp: <code>
                                    {transaction.inputs.length > 0 && transaction.inputs[0].metadata.consumedTime}
                                    {transaction.inputs.length === 0 && transaction.outputs.length > 0 && transaction.outputs[0].metadata.recordedTime}
                                    {transaction.inputs.length === 0 && transaction.outputs.length === 0 && "---"}
                                </code>
                                </Card.Text>
                                {transaction.commands.map((it, i) => <Card.Text key={i}>
                                    Command: <code>{it.value}</code>
                                </Card.Text>)}

                                <hr />

                                <h4>States</h4>

                                <Table>
                                    <thead>
                                    <th>Type</th>
                                    <th>State</th>
                                    </thead>
                                    <tbody>
                                    {transaction.inputs.map((it, index) => <StateRow key={`input_${index}`} type="input" state={it} />)}
                                    {transaction.outputs.map((it, index) => <StateRow key={`input_${index}`} type="output" state={it} />)}
                                    {transaction.references.map((it, index) => <StateRow key={`input_${index}`} type="reference" state={it} />)}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}
export default TransactionPage;
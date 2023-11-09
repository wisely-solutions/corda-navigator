import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import StateList from "../components/states/StateList";
import BasePage from "./layout/BasePage";
import {Col, Container, Row} from "react-bootstrap";
import {fetchState, fetchStates} from "../services/RpcService";
import {StatesTableShow} from "../components/states/StatesTableShow";
import Loading from "../components/ux/loading/Loading";

const LinearStatesPage = () => {
    let {nodeId, linearId} = useParams();
    let [states, setStates] = useState([]);
    let [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false)
        fetchStates(nodeId, {linearId: linearId}, {
            itemsPerPage: 10,
            page: 1
        }).then(r => {
            setStates(r.data)
            setLoaded(true)
        }).catch(e => {
            console.error(e)
        })
    }, [nodeId, linearId])


    if (!loaded) {
        return <Loading/>
    }

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <h2>Linear States</h2>
                        <small><code>{linearId}</code></small>

                        <StatesTableShow stateResult={states} />
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}

export default LinearStatesPage;
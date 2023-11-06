import React from "react";
import {useParams} from "react-router-dom";
import StateList from "../components/states/StateList";
import BasePage from "./layout/BasePage";
import {Col, Container, Row} from "react-bootstrap";

const StatesPage = () => {
    let {nodeId} = useParams();

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <h2>States</h2>
                        <StateList name={nodeId}/>
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}

export default StatesPage;
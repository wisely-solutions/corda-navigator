import React, {useEffect, useState} from "react";
import {fetchTransaction, fetchTransactions} from "../services/RpcService";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/ux/loading/Loading";
import BasePage from "./layout/BasePage";
import {Card, Col, Container, Row, Table} from "react-bootstrap";
import TransactionList from "../components/transaction/TransactionList";


const TransactionsPage = () => {
    let {nodeId} = useParams();

    return (
        <BasePage>
            <Container>
                <Row>
                    <Col>
                        <TransactionList name={nodeId} />
                    </Col>
                </Row>
            </Container>
        </BasePage>
    );
}
export default TransactionsPage;
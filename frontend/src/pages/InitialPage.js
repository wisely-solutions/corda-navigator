// src/components/InitialPage.js

import React from 'react';
import {useNavigate} from 'react-router-dom';
import NodeList from "../components/node/list/NodeList";
import {Col, Container, Row} from "react-bootstrap";
import BasePage from "./layout/BasePage";
import {useStores} from "../store";
import {observer} from "mobx-react";
import NodeRegister from "../components/node/register/NodeRegister";

const InitialPage = () => {
    let {nodesStore} = useStores();

    if (nodesStore.isEmpty) {
        // Just add!
        return (
            <BasePage>
                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div style={{minWidth: "500px"}}>
                        <main role="main" className="inner cover">
                            <h1 className="cover-heading">Add your first Corda Node</h1>
                            <p></p>
                            <NodeRegister />
                        </main>
                    </div>
                </div>
            </BasePage>
        )
    }

    return (
        <BasePage>
            <NodeList/>
        </BasePage>
    );
};

export default observer(InitialPage);

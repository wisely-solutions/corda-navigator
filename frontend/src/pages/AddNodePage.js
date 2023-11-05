// src/components/InitialPage.js

import React from 'react';
import BasePage from "./layout/BasePage";
import {observer} from "mobx-react";
import NodeRegister from "../components/node/register/NodeRegister";
import {useNavigate} from "react-router-dom";

const AddNodePage = () => {
    let navigate = useNavigate()

    return (
        <BasePage>
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <div style={{minWidth: "500px"}}>
                    <main role="main" className="inner cover">
                        <h1 className="cover-heading">Add Corda Node</h1>
                        <p></p>
                        <NodeRegister onCreated={(name) => navigate(`/`)} />
                    </main>
                </div>
            </div>
        </BasePage>
    );
};

export default AddNodePage;

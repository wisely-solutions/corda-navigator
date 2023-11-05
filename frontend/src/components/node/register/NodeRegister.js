// src/components/NodeRegister.js

import React, { useState } from 'react';
import {Button} from "react-bootstrap";
import {fetchNodes, registerNode} from "../../../services/RpcService";
import {useStores} from "../../../store";

const NodeRegister = ({onCreated}) => {
    let { nodesStore } = useStores()

    const handleRegister = async (formData) => {
        try {
            await registerNode(formData);
            alert('Node Registered!');
            // Refresh the list of clients
            const response = await fetchNodes();
            nodesStore.addNode(formData)
            onCreated(formData.name)
        } catch (error) {
            console.error('Error registering Node:', error);
            alert('Failed to register node.');
        }
    };

    const [formData, setFormData] = useState({
        name: '',
        host: '',
        port: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        if (e.target.name === "name") {
            setFormData({ ...formData, [e.target.name]: e.target.value.replace(/[^a-zA-Z0-9]/gi, "")});
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister(formData);
        setFormData({ name: '', host: '', port: '', username: '', password: '' });
    };

    return (
        <div>
            <form className="needs-validation" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col mb-3">
                        <label>Name</label>
                        <input type="text" className="form-control"
                               pattern="[a-zA-Z0-9]+"
                               name="name"
                               onChange={handleChange}
                               placeholder=""
                               value={formData.name}
                               required=""
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Hostname</label>
                        <input type="text" className="form-control"
                               name="host"
                               onChange={handleChange}
                               placeholder=""
                               value={formData.host}
                               required=""
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Port</label>
                        <input type="number" className="form-control"
                               name="port"
                               onChange={handleChange}
                               placeholder=""
                               value={formData.port}
                               required=""
                        />
                    </div>
                </div>

                <hr className="mb-4" />
                <h3>Credentials</h3>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Username</label>
                        <input type="text" className="form-control"
                               name="username"
                               onChange={handleChange}
                               placeholder=""
                               value={formData.username}
                               required=""
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control"
                               name="password"
                               onChange={handleChange}
                               placeholder=""
                               value={formData.password}
                               required=""
                        />
                    </div>
                </div>
                <button className="btn btn-primary btn-lg btn-block" type="submit">Register Node</button>
            </form>
        </div>
    );
};

export default NodeRegister;

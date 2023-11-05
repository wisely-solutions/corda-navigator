// src/components/NodeRegister.js

import React from 'react';
import {useStores} from "../../../store";
import {useNavigate} from "react-router-dom";
import logo from './corda.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import {deleteNode} from "../../../services/RpcService";


const NodeRegister = ({}) => {
    const { nodesStore } = useStores()
    const navigate = useNavigate()

    const onSelect = (node) => {
        navigate(`/node/${node.name}`)
    }

    const onDelete = (e, node) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
            deleteNode(node.name)
                .then(() => nodesStore.removeNode(node.name))
                .catch(e => {
                    console.log(e)
                    alert(`Error removing ${node.name}`)
                })
        }
    }

    return (
        <div className="list-group">
            {nodesStore.nodes.map((node, index) => (
                <a style={{cursor: "pointer"}} onClick={() => onSelect(node)} key={index} className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                    <img src={logo} alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0" />
                    <div className="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 className="mb-0">{node.name}</h6>
                            <p className="mb-0 opacity-75">Connected via RPC on {node.host}:{node.port}</p>
                        </div>
                    </div>
                    <small className="opacity-50 text-nowrap" onClick={(e) => onDelete(e, node)}>
                        <FontAwesomeIcon icon={faXmark} color="red" size="2x" />
                    </small>
                </a>
            ))}
            <a style={{cursor: "pointer"}} onClick={() => navigate("/node/add")} className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                <FontAwesomeIcon icon={faPlusSquare} color="red" size="x" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div>
                        <h6 className="mb-0">Add new Node</h6>
                        <p className="mb-0 opacity-75"></p>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default NodeRegister;

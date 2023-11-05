// src/components/NodeStates.js

import React, {useEffect, useState} from 'react';
import {fetchFilterStates, fetchStates} from '../services/RpcService';
import Loading from "./ux/loading/Loading";
import {Badge, Button, Card, Col, Row} from "react-bootstrap";

import 'react-json-pretty/themes/monikai.css';


const StateDetail = ({state}) => {
    return (
        <tr>
            <td colSpan={5} style={{padding: "0px"}}>
                <Row style={{backgroundColor: "#eee", padding: "10px"}}>
                    <Col>
                        <dl style={{margin: "0px"}}>
                            <dt>Reference</dt>
                            <dd>{state.metadata.ref}</dd>
                            <dt>Contract</dt>
                            <dd style={{margin: "0px"}}><code>{state.data.contract}</code></dd>
                        </dl>
                    </Col>
                    <Col>
                        <dl style={{margin: "0px"}}>
                            <dt>Notary</dt>
                            <dd>{state.metadata.notary.name}</dd>
                            <dt>Consumed</dt>
                            <dd style={{margin: "0px"}}>
                                {state.metadata.consumedTime && state.metadata.consumedTime}
                                {!state.metadata.consumedTime && "---"}
                            </dd>
                        </dl>
                    </Col>
                </Row>
                <div style={{display: "grid"}}>
                    <pre style={{display: "grid", overflow: "auto", maxWidth: "100%", padding: "20px", backgroundColor: "#bbb"}}>{JSON.stringify(state.data.data, null, 2)}</pre>
                </div>
            </td>
        </tr>
    )
}

const StateRow = ({state}) => {
    const [open, setOpen] = useState(false)
    let bgFromStatus = (status) => {
        if (status === "UNCONSUMED") return "success"
        return "secondary"
    }
    let bgFromRelevancy = (status) => {
        if (status === "RELEVANT") return "primary"
        return "secondary"
    }

    return (
        <>
            <tr onClick={() => setOpen(!open)} style={{cursor: "pointer"}}>
                <td><code>{state.metadata.contractStateClassName}</code></td>
                <td>{state.metadata.recordedTime}</td>
                <td>
                    {state.metadata.consumedTime && state.metadata.consumedTime}
                    {!state.metadata.consumedTime && <span>---</span>}
                </td>
                <td><Badge bg={bgFromStatus(state.metadata.status)}>{state.metadata.status}</Badge></td>
                <td><Badge bg={bgFromRelevancy(state.metadata.relevancyStatus)}>{state.metadata.relevancyStatus}</Badge></td>
                {/* Render other state properties as needed */}
            </tr>
            {open && <StateDetail state={state} />}
        </>
    )
}

const SearchFilters = ({ initialFilters, onChange }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [possibleStateTypes, setPossibleStateTypes] = useState([])
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchFilterStates()
            .then(r => {
                setPossibleStateTypes(r.data)
            })
            .catch(e => {
                console.error('Error fetching filter states:', e);
            })
    }, []);

    const append = (list, item) => {
        if (!list.find(it => it === item)) {
            list.push(item)
        }
        return list
    }

    const changeStateType = (e) => {
        if (e.target.checked) {
            setFilters({...filters, stateTypes: append(filters.stateTypes, e.target.value)})
        } else {
            setFilters({...filters, stateTypes: filters.stateTypes.filter(it => it !== e.target.value)})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onChange(filters)
    }

    if (showFilters) {
        return (
            <Card style={{margin: "20px"}}>
                <Card.Header>
                    <Card.Title style={{marginBottom: "0px"}}>Filters</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <div className="mb-3">
                                <label className="form-label">State Type</label>
                                {possibleStateTypes.map(stateType =>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value={stateType} checked={!!filters.stateTypes.find(it => it === stateType)}
                                               onChange={changeStateType} />
                                        <label className="form-check-label" >
                                            {stateType}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <div className="text-end">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <Button variant="danger" onClick={() => setShowFilters(false)}>Close</Button>
                            <Button onClick={handleSubmit}>Apply Filters</Button>
                        </div>
                    </div>
                </Card.Footer>
            </Card>
        )
    } else {
        return (
            <div>
                <p className="text-end">
                    <Button onClick={() => setShowFilters(true)}>Filters</Button>
                </p>
            </div>
        )
    }
}

const SearchStates = ({name, filters}) => {
    const [loaded, setLoaded] = useState(false)
    const [stateResult, setStateResult] = useState([]);

    useEffect(() => {
        setLoaded(false)
        fetchStates(name, filters)
            .then(r => {
                setStateResult(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching states:', e);
            })
    }, [name, filters]);



    if (!loaded) {
        return <Loading />
    }

    return (
        <div className="table-responsive small">
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Recorded</th>
                    <th scope="col">Consumed</th>
                    <th scope="col">Status</th>
                    <th scope="col">Relevancy</th>
                </tr>
                </thead>
                <tbody>
                {stateResult.items.map((state, index) => (
                    <StateRow state={state} key={index} />
                ))}
                </tbody>
            </table>
        </div>
    )
}


const NodeStates = ({ name }) => {
    const [filters, setFilters] = useState({
        stateTypes: []
    })

    return (
        <>
            <SearchFilters initialFilters={filters} onChange={(newFilters) => setFilters(newFilters)} />
            <SearchStates name={name} filters={filters} />
        </>
    );
};

export default NodeStates;

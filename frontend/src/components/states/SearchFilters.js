import React, {useEffect, useState} from "react";
import {fetchFilterStates} from "../../services/RpcService";
import {Button, Card, Col, Row} from "react-bootstrap";

export const SearchFilters = ({initialFilters, onChange}) => {
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
                                        <input className="form-check-input" type="checkbox" value={stateType}
                                               checked={!!filters.stateTypes.find(it => it === stateType)}
                                               onChange={changeStateType}/>
                                        <label className="form-check-label">
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
// src/components/NodeStates.js

import React, {useState} from 'react';

import 'react-json-pretty/themes/monikai.css';
import {SearchFilters} from "./SearchFilters";
import {StatesTable} from "./StatesTable";


const NodeStates = ({ name }) => {
    const [filters, setFilters] = useState({
        stateTypes: []
    })

    return (
        <>
            <SearchFilters initialFilters={filters} onChange={(newFilters) => setFilters(newFilters)} />
            <StatesTable name={name} filters={filters} itemsPerPage={20} />
        </>
    );
};

export default NodeStates;

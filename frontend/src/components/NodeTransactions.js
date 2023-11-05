// src/components/NodeTransactions.js

import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/RpcService';

const NodeTransactions = ({ name }) => {
    const [transactions, setTransactions] = useState([]);


    return (
        <div>
            {transactions.map((tx, index) => (
                <div key={index}>
                    <p>{tx.id}</p>
                    {/* Render other transaction properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default NodeTransactions;

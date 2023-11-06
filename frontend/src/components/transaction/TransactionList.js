// src/components/NodeTransactions.js

import React from 'react';
import {TransactionTable} from "./TransactionsTable";

const TransactionList = ({name}) => {

    return (
        <div>
            <TransactionTable name={name} filters={{}} itemsPerPage={20}/>
        </div>
    );
};

export default TransactionList;

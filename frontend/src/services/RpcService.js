// src/services/RpcService.js

import axios from 'axios';

const API_BASE_URL = '/api'; // Adjust this to the actual backend URL

export const registerNode = async (rpcClientData) => {
    return axios.post(`${API_BASE_URL}/node/register`, rpcClientData);
};
export const deleteNode = async (nodeId) => {
    return axios.delete(`${API_BASE_URL}/node/${nodeId}`);
};
export const fetchTransactions = async (nodeId) => {
    return axios.get(`${API_BASE_URL}/node/${nodeId}/transactions`);
};

export const fetchTransaction = async (nodeId, txId) => {
    return axios.get(`${API_BASE_URL}/node/${nodeId}/transaction/${txId}`);
};

export const fetchNodes = async () => {
    return axios.get(`${API_BASE_URL}/node/list`);
};

export const fetchStates = async (nodeId, filters) => {
    let query = ""
    if (filters.stateTypes && filters.stateTypes.length && filters.stateTypes.length > 0) {
        query = query + filters.stateTypes.map(it => `stateType=${it}`).join("&")
    }
    if (query !== "") {
        return axios.get(`${API_BASE_URL}/node/${nodeId}/states?${query}`);
    } else {
        return axios.get(`${API_BASE_URL}/node/${nodeId}/states`);
    }
};

export const fetchFilterStates = async () => {
    return axios.get(`${API_BASE_URL}/filter/states`);
};

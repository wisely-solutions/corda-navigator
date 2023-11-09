// src/services/RpcService.js

import axios from 'axios';

const API_BASE_URL = '/api'; // Adjust this to the actual backend URL

export const registerNode = async (rpcClientData) => {
    return axios.post(`${API_BASE_URL}/node/register`, rpcClientData);
};
export const deleteNode = async (nodeId) => {
    return axios.delete(`${API_BASE_URL}/node/${nodeId}`);
};
export const fetchTransactions = async (nodeId, filters, pagination) => {
    let query = `page=${pagination.page}&pageItems=${pagination.itemsPerPage}`
    return axios.get(`${API_BASE_URL}/node/${nodeId}/transaction/list?${query}`);
};

export const fetchTransaction = async (nodeId, txId) => {
    return axios.get(`${API_BASE_URL}/node/${nodeId}/transaction/${txId}`);
};

export const fetchNodes = async () => {
    return axios.get(`${API_BASE_URL}/node/list`);
};

export const fetchStates = async (nodeId, filters, pagination) => {
    let query = `page=${pagination.page}&pageItems=${pagination.itemsPerPage}`
    if (filters.stateTypes && filters.stateTypes.length && filters.stateTypes.length > 0) {
        query = query + "&" + filters.stateTypes.map(it => `stateType=${it}`).join("&")
    }
    if (filters.linearId) {
        query = query + `&linearId=${filters.linearId}`
    }
    return axios.get(`${API_BASE_URL}/node/${nodeId}/state/search?${query}`);
};

export const fetchState = async (nodeId, txId, outputIndex) => {
    return axios.get(`${API_BASE_URL}/node/${nodeId}/state/${txId}/${outputIndex}`);
};

export const fetchNetwork = async (nodeId) => {
    return axios.get(`${API_BASE_URL}/node/${nodeId}/network`);
};

export const fetchFilterStates = async () => {
    return axios.get(`${API_BASE_URL}/filter/states`);
};

import React, {useEffect, useState} from "react";
import {fetchStates} from "../../services/RpcService";
import Loading from "../ux/loading/Loading";
import {Badge, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {StateDetail} from "./StateDetail";
import {useNavigate, useParams} from "react-router-dom";
import PaginationComponent from "../pagination/Pagination";
import {StatesTableShow} from "./StatesTableShow";

export const StatesTable = ({name, filters, itemsPerPage}) => {
    const [loaded, setLoaded] = useState(false)
    const [stateResult, setStateResult] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoaded(false)
        fetchStates(name, filters, {
            itemsPerPage: itemsPerPage,
            page: page,
        })
            .then(r => {
                setStateResult(r.data)
                setLoaded(true)
            })
            .catch(e => {
                console.error('Error fetching states:', e);
            })
    }, [name, filters, itemsPerPage, page]);


    if (!loaded) {
        return <Loading/>
    }

    return (
        <>
            <StatesTableShow stateResult={stateResult}></StatesTableShow>
            <PaginationComponent pagination={stateResult.pagination} onPageChange={p => setPage(p)}/>
        </>
    )
}

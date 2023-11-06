import React from "react";

const SideBar = () => {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" style={{width: "280px", position: "fixed", left: "0", top: "55px", "bottom": "0"}}>
            <a href="/"
               className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <svg className="bi pe-none me-2" width="40" height="32">
                    <use xlinkHref="#bootstrap"/>
                </svg>
                <span className="fs-4">Navigator</span>
            </a>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active" aria-current="page">
                        <svg className="bi pe-none me-2" width="16" height="16">
                            <use xlinkHref="#home"/>
                        </svg>
                        Home
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-body-emphasis">
                        <svg className="bi pe-none me-2" width="16" height="16">
                            <use xlinkHref="#speedometer2"/>
                        </svg>
                        Dashboard
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-body-emphasis">
                        <svg className="bi pe-none me-2" width="16" height="16">
                            <use xlinkHref="#table"/>
                        </svg>
                        Orders
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-body-emphasis">
                        <svg className="bi pe-none me-2" width="16" height="16">
                            <use xlinkHref="#grid"/>
                        </svg>
                        Products
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link link-body-emphasis">
                        <svg className="bi pe-none me-2" width="16" height="16">
                            <use xlinkHref="#people-circle"/>
                        </svg>
                        Customers
                    </a>
                </li>
            </ul>
        </div>
    );
}
export default SideBar;
import React from "react";
import {Link, useNavigate, useParams} from "react-router-dom";


import logo from './corda.png';
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useStores} from "../../store";
const TopBar = () => {
    let navigate = useNavigate()
    let { nodesStore } = useStores()
    let { nodeId } = useParams()

    return (
        <Navbar expand="xl" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand style={{cursor: "pointer"}} onClick={() => navigate("/")}>
                    <img
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Corda Navigator Logo"
                    />
                </Navbar.Brand>
                {nodeId && <Nav>
                    <Nav.Link onClick={() => navigate(`/node/${nodeId}`)}>States</Nav.Link>
                </Nav>}
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown title="Nodes" >
                            {nodesStore.nodes.map(it =>
                                <Nav.Link key={it.name}
                                          href={""}
                                          onClick={() => navigate(`/node/${it.name}`)}
                                    >
                                    {it.name}
                                </Nav.Link>
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default TopBar;
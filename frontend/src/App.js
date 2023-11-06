import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import InitialPage from "./pages/InitialPage";
import NotFoundPage from "./pages/NotFound";
import NodePage from "./pages/NodePage";
import {StoreProvider} from "./store";
import NodesContext from "./context/NodesContext";
import AddNodePage from "./pages/AddNodePage";
import TransactionPage from "./pages/TransactionPage";
import StatePage from "./pages/StatePage";

function App() {
    return (
        <StoreProvider>
            <NodesContext>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<InitialPage/>}/>
                        <Route path="/node/add" element={<AddNodePage/>}/>
                        <Route path="/node/:nodeId" element={<NodePage/>}/>
                        <Route path="/node/:nodeId/transaction/:txId" element={<TransactionPage/>}/>
                        <Route path="/node/:nodeId/state/:txId/:outputIndex" element={<StatePage/>}/>
                        {/* Add other routes as needed */}
                        <Route element={<NotFoundPage/>}/>
                    </Routes>
                </Router>
            </NodesContext>
        </StoreProvider>
    );
}

export default App;

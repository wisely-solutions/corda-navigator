import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import InitialPage from "./pages/InitialPage";
import NotFoundPage from "./pages/NotFound";
import NodePage from "./pages/NodePage";
import {StoreProvider} from "./store";
import NodesContext from "./context/NodesContext";
import AddNodePage from "./pages/AddNodePage";
import TransactionPage from "./pages/TransactionPage";
import StatePage from "./pages/StatePage";
import StatesPage from "./pages/StatesPage";
import TransactionsPage from "./pages/TransactionsPage";
import LinearStatesPage from "./pages/LinearStatesPage";

function App() {
    return (
        <StoreProvider>
            <NodesContext>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<InitialPage/>}/>
                        <Route path="/node/add" element={<AddNodePage/>}/>
                        <Route path="/node/:nodeId" element={<NodePage/>}/>
                        <Route path="/node/:nodeId/states" element={<StatesPage/>}/>
                        <Route path="/node/:nodeId/states/linear/:linearId" element={<LinearStatesPage/>}/>
                        <Route path="/node/:nodeId/transactions" element={<TransactionsPage/>}/>
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

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import InitialPage from "./pages/InitialPage";
import NotFoundPage from "./pages/NotFound";
import NodePage from "./pages/NodePage";
import {StoreProvider} from "./store";
import NodesContext from "./context/NodesContext";
import AddNodePage from "./pages/AddNodePage";

function App() {
    return (
        <StoreProvider>
            <NodesContext>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<InitialPage/>}/>
                        <Route path="/node/add" element={<AddNodePage/>}/>
                        <Route path="/node/:name" element={<NodePage/>}/>
                        {/* Add other routes as needed */}
                        <Route element={<NotFoundPage/>}/>
                    </Routes>
                </Router>
            </NodesContext>
        </StoreProvider>
    );
}

export default App;

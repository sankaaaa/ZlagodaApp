import {BrowserRouter, Routes, Route, Link} from "react-router-dom"

// pages
import Employees from "./pages/Employees"
import CreateEmployee from "./pages/CreateEmployee"
import UpdateEmployee from "./pages/UpdateEmployee"
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <h1>Zlagoda</h1>
                <Link to="/employees">Employees</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/employees" element={<Employees/>}/>
                <Route path="/create-employee" element={<CreateEmployee/>}/>
                <Route path="/:id_employee" element={<UpdateEmployee/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
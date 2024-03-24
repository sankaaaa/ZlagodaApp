import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

// pages
import Employees from "./pages/Employees"
import CreateEmployee from "./pages/CreateEmployee"
import Update from "./pages/Update"

function App() {
  return (
      <BrowserRouter>
        <nav>
          <h1>Zlagoda</h1>
          <Link to="/employees">Employees</Link>
        </nav>
        <Routes>
          <Route path="/employees" element={<Employees />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/:id" element={<Update />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
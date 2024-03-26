import {BrowserRouter, Routes, Route, Link, useLocation} from "react-router-dom";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import Login from "./pages/Login";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";

import '../src/styles/links-stuff.css';
import Categories from "./pages/Categories";
import CreateCategory from "./pages/CreateCategory";
import UpdateCategory from "./pages/UpdateCategory";
import {useState} from "react";

function Navigation({userRole}) { // Додав аргумент userRole
    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <nav>
            <h1>Zlagoda</h1>
            <div className="fline">
                <div className="nav-links">
                    <Link to="/employees">Employees</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/categories">Categories</Link>
                </div>
                <div className="logout">
                    <p>{userRole}</p> {/* Додав відображення ролі користувача */}
                    <Link to="/">Log out</Link>
                </div>
            </div>
        </nav>
    );
}

function App() {
    const [userRole, setUserRole] = useState(""); // Додав стан для ролі користувача

    return (
        <BrowserRouter>
            <Navigation userRole={userRole}/> {/* Передав стан ролі користувача */}
            <Routes>
                <Route path="/" element={<Login handleUserRole={setUserRole}/>}/> {/* Передав функцію handleUserRole */}
                <Route path="/employees" element={<Employees/>}/>
                <Route path="/create-employee" element={<CreateEmployee/>}/>
                <Route path="/:id_employee" element={<UpdateEmployee/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/create-product" element={<CreateProduct/>}/>
                <Route path="/products/:id_product" element={<UpdateProduct/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/create-category" element={<CreateCategory/>}/>
                <Route path="/categories/:category_number" element={<UpdateCategory/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

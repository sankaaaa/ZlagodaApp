import {BrowserRouter, Routes, Route, Link, useLocation} from "react-router-dom";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import Login from "./pages/Login";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Categories from "./pages/Categories";
import CreateCategory from "./pages/CreateCategory";
import UpdateCategory from "./pages/UpdateCategory";
import {useState, useEffect} from "react";

import '../src/styles/links-stuff.css';
import Customers from "./pages/Customers";
import CreateCustomer from "./pages/CreateCustomer";
import UpdateCustomer from "./pages/UpdateCustomer";
import StoreProducts from "./pages/StoreProducts";

function Navigation({userRole}) {
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
                    <Link to="/customers">Customers</Link>
                    <Link to="/store-products">Store products</Link>

                </div>
                <div className="logout">
                    <p>{userRole}</p>
                    <Link to="/">Log out</Link>
                </div>
            </div>
        </nav>
    );
}

function App() {
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    const handleUserRole = (role) => {
        setUserRole(role);
        localStorage.setItem("userRole", role);
    };

    return (
        <BrowserRouter>
            <Navigation userRole={userRole}/>
            <Routes>
                <Route path="/" element={<Login handleUserRole={handleUserRole}/>}/>
                <Route path="/employees" element={<Employees/>}/>
                <Route path="/create-employee" element={<CreateEmployee/>}/>
                <Route path="/:id_employee" element={<UpdateEmployee/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/create-product" element={<CreateProduct/>}/>
                <Route path="/products/:id_product" element={<UpdateProduct/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/create-category" element={<CreateCategory/>}/>
                <Route path="/categories/:category_number" element={<UpdateCategory/>}/>
                <Route path="/customers" element={<Customers/>}/>
                <Route path="/create-customer" element={<CreateCustomer/>}/>
                <Route path="/customers/:card_number" element={<UpdateCustomer/>}/>
                <Route path="/store-products" element={<StoreProducts/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;

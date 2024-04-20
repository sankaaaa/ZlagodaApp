import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
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
import "../src/styles/links-stuff.css";
import Customers from "./pages/Customers";
import CreateCustomer from "./pages/CreateCustomer";
import UpdateCustomer from "./pages/UpdateCustomer";
import StoreProducts from "./pages/StoreProducts";
import CreateStoreProduct from "./pages/CreateStoreProduct";
import UpdateStoreProduct from "./pages/UpdateStoreProduct";
import Cheques from "./pages/Cheques";
import CreateCheque from "./pages/CreateCheque";
import Sales from "./pages/Sales";
import MyPage from "./pages/MyPage";

function Navigation({ userRole }) {
    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <nav>
            <h1>Zlagoda</h1>
            <div className="fline">
                <div className="nav-links">
                    {userRole !== "cashier" && <Link to="/employees">Employees</Link>}
                    <Link to="/products">Products</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/customers">Customers</Link>
                    <Link to="/store-products">Store products</Link>
                    <Link to="/cheques">Cheques</Link>
                    <Link to="/sales">Sales</Link>
                    <Link to="/my-page">My page</Link>
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
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const storedUsername = localStorage.getItem("userLogin");
        if (storedRole) {
            setUserRole(storedRole);
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleUserRole = (role) => {
        setUserRole(role);
    };

    return (
        <BrowserRouter>
            <Navigation userRole={userRole} />
            <Routes>
                <Route path="/" element={<Login handleUserRole={handleUserRole} />} />
                {userRole !== "cashier" && <Route path="/employees" element={<Employees />} />}
                {userRole !== "cashier" && <Route path="/create-employee" element={<CreateEmployee />} />}
                {userRole !== "cashier" && <Route path="/:id_employee" element={<UpdateEmployee />} />}
                <Route path="/products" element={<Products />} />
                {userRole !== "cashier" && <Route path="/create-product" element={<CreateProduct />} />}
                {userRole !== "cashier" && <Route path="/products/:id_product" element={<UpdateProduct />} />}
                <Route path="/categories" element={<Categories />} />
                {userRole !== "cashier" && <Route path="/create-category" element={<CreateCategory />} />}
                {userRole !== "cashier" && <Route path="/categories/:category_number" element={<UpdateCategory />} />}
                <Route path="/customers" element={<Customers />} />
                {userRole !== "cashier" && <Route path="/create-customer" element={<CreateCustomer />} />}
                <Route path="/customers/:card_number" element={<UpdateCustomer />} />
                <Route path="/store-products" element={<StoreProducts />} />
                {userRole !== "cashier" && <Route path="/create-store-product" element={<CreateStoreProduct />} />}
                {userRole !== "cashier" && <Route path="/store-products/:upc" element={<UpdateStoreProduct />} />}
                <Route path="/cheques" element={<Cheques />} />
                {userRole !== "manager" && <Route path="/create-cheque" element={<CreateCheque />} />}
                <Route path="/sales" element={<Sales />} />
                <Route path="/my-page" element={<MyPage username={username} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

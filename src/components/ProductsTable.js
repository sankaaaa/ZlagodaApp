import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "../styles/employee-table.css";

const ProductsTable = ({products, setProducts, userRole}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: "ascending"});
    const [categoryFilter, setCategoryFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [formError, setFormError] = useState(null);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryRequests = products.map(product => fetch(`http://localhost:8081/product/cat/${product.category_number}`));
                const categoryResponses = await Promise.all(categoryRequests);
                const categoryData = await Promise.all(categoryResponses.map(response => response.json()));
                const categoriesMap = {};
                categoryData.forEach((category, index) => {
                    categoriesMap[products[index].category_number] = `${category.category_name}(${products[index].category_number})`;
                });
                setCategories(categoriesMap);
            } catch (error) {
                console.error(error);
                setFormError("Could not fetch categories");
            }
        };
        fetchCategories();
    }, [products]);

    const sortedProducts = products
        .filter(
            (product) =>
                (!categoryFilter ||
                    parseInt(product.category_number) === parseInt(categoryFilter) ||
                    categories[product.category_number]?.toLowerCase().includes(categoryFilter.toLowerCase())) &&
                (!nameFilter || product.product_name.toLowerCase().includes(nameFilter.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortConfig.key !== null) {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
            }
            return 0;
        });

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({key, direction});
    };

    const handleDelete = async (productId) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/product/${productId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Could not delete product due to integration reasons");
            }
            const updatedProducts = products.filter((product) => product.id_product !== productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error(error);
            if (error.message.includes("500")) {
                setFormError("Could not delete product due to integration reasons");
            } else {
                setFormError(error.message);
            }
        }
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleNameFilterChange = (e) => {
        setNameFilter(e.target.value);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container" style={{display: userRole === "cashier" ? "none" : "block"}}>
                    {userRole === "manager" && (
                        <Link to="/create-product" className="link-create-new">
                            Create New Product
                        </Link>
                    )}
                </div>
                <div>
                    <label htmlFor="categoryFilter">Category Filter:</label>
                    <input type="text" id="categoryFilter" value={categoryFilter}
                           onChange={handleCategoryFilterChange}/>
                </div>
                <div>
                    <label htmlFor="nameFilter">Name Filter:</label>
                    <input type="text" id="nameFilter" value={nameFilter} onChange={handleNameFilterChange}/>
                </div>
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
            {formError && <p className="error">{formError}</p>}
            <table className="product-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort("id_product")}>ID</th>
                    <th onClick={() => requestSort("category_number")}>Category</th>
                    <th onClick={() => requestSort("product_name")}>Name</th>
                    <th onClick={() => requestSort("characteristics")}>Characteristics</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedProducts.map((product) => (
                    <tr key={product.id_product}>
                        <td style={{fontWeight: "bold"}}>
                            {product.id_product}.
                        </td>
                        <td>{categories[product.category_number] || 'Loading...'}</td>
                        <td>{product.product_name}</td>
                        <td>{product.characteristics}</td>
                        {userRole === "manager" ? (
                            <td>
                                <button className="edit-button">
                                    <Link to={`/products/${product.id_product}`}>Edit</Link>
                                </button>
                                <button className="edit-button" onClick={() => handleDelete(product.id_product)}>
                                    Delete
                                </button>
                            </td>
                        ) : (
                            <td>
                                <button className="edit-button" disabled style={{backgroundColor: "#BF863D"}}>
                                    Edit
                                </button>
                                <button className="edit-button" disabled style={{backgroundColor: "#BF863D"}}>
                                    Delete
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;

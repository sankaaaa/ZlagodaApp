import {useState} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";

const ProductsTable = ({products, setProducts}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [setSelectedProduct] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const sortedProducts = products
        .filter(product => (!categoryFilter || parseInt(product.category_number) === parseInt(categoryFilter)) &&
            (!nameFilter || product.product_name.toLowerCase().includes(nameFilter.toLowerCase())))
        .sort((a, b) => {
            if (sortConfig.key !== null) {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
            }
            return 0;
        });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
    };

    const handleDelete = async (productId) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/product/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Could not delete product');
            }
            const updatedProducts = products.filter(product => product.id_product !== productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleNameFilterChange = (e) => {
        setNameFilter(e.target.value);
    };

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-product" className="link-create-new">Create New Product</Link>
                </div>
                <div>
                    <label htmlFor="categoryFilter">Category Filter:</label>
                    <input
                        type="text"
                        id="categoryFilter"
                        value={categoryFilter}
                        onChange={handleCategoryFilterChange}
                    />
                </div>
                <div>
                    <label htmlFor="nameFilter">Name Filter:</label>
                    <input
                        type="text"
                        id="nameFilter"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                    />
                </div>
            </div>
            <table className="product-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('id_product')}>ID</th>
                    <th onClick={() => requestSort('category_number')}>Category</th>
                    <th onClick={() => requestSort('product_name')}>Name</th>
                    <th onClick={() => requestSort('characteristics')}>Characteristics</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedProducts.map(product => (
                    <tr key={product.id_product}>
                        <td style={{fontWeight: 'bold'}}
                            onClick={() => handleRowClick(product)}>{product.id_product}.
                        </td>
                        <td>{product.category_number}</td>
                        <td>{product.product_name}</td>
                        <td>{product.characteristics}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={`/products/${product.id_product}`}>Edit</Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(product.id_product)}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;

import {useState} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";

const CategoriesTable = ({categories, setCategories, userRole}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productList, setProductList] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formError, setFormError] = useState(null);

    const sortedCategories = categories.sort((a, b) => {
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

    const handleRowClick = (category) => {
        setSelectedCategory(category);
        fetchCategories(category.category_number);
        setIsPopupOpen(true);
    };

    const fetchCategories = async (categoryNumber) => {
        try {
            const response = await fetch(`http://localhost:8081/category/a/${categoryNumber}`);
            if (!response.ok)
                throw new Error('Could not fetch categories');
            const data = await response.json();
            setProductList(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (catNumber) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/category/${catNumber}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Could not delete category due to integration reasons');
            }
            const updatedCats = categories.filter(category => category.category_number !== catNumber);
            setCategories(updatedCats);
        } catch (error) {
            console.error(error);
            if (error.message.includes("500")) {
                setFormError("Could not delete category due to integration reasons");
            } else {
                setFormError(error.message);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="cat-table">
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="cat-close" onClick={() => setIsPopupOpen(false)}>&times;</span>
                        <h2>Products in Category {selectedCategory.category_number}</h2>
                        <ul>
                            {productList.map(product => (
                                <li key={product.id_product}>{product.product_name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div className="top-line">
                <div className="create-new-container" style={{display: userRole === "cashier" ? "none" : "block"}}>
                    {userRole === "manager" && (
                        <Link to="/create-category" className="link-create-new">Create New Category</Link>
                    )}
                </div>
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
            {formError && <p className="error">{formError}</p>}
            <table className="category-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('category_number')}>Number</th>
                    <th onClick={() => requestSort('category_name')}>Name</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedCategories.map(category => (
                    <tr key={category.category_number}>
                        <td style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleRowClick(category)}>
                            {category.category_number}.
                        </td>
                        <td>{category.category_name}</td>
                        <td>
                            {userRole === "manager" ? (
                                <>
                                    <button className="edit-button">
                                        <Link to={`/categories/${category.category_number}`}>Edit</Link>
                                    </button>
                                    <button className="edit-button"
                                            onClick={() => handleDelete(category.category_number)}>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="edit-button" disabled style={{backgroundColor: "#BF863D"}}>
                                        Edit
                                    </button>
                                    <button className="edit-button" disabled style={{backgroundColor: "#BF863D"}}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesTable;

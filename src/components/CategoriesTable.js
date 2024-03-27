import {useState} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";

const CategoriesTable = ({categories}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productList, setProductList] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        fetchProducts(category.category_number);
        setIsPopupOpen(true);
    };

    const fetchProducts = async (categoryNumber) => {
        const {data, error} = await supabase
            .from('product')
            .select()
            .eq('category_number', categoryNumber);
        if (error) {
            console.log(error);
        } else {
            setProductList(data);
        }
    };

    const handleDelete = async (category) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;

        const {data, error} = await supabase
            .from('category')
            .delete()
            .eq('category_number', category.category_number);

        if (error) {
            console.log(error);
        } else {
            console.log(data);
            window.location.reload();
        }
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
                <div className="create-new-container">
                    <Link to="/create-category" className="link-create-new">Create New Category</Link>
                </div>
            </div>
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
                            <button className="edit-button">
                                <Link to={`/categories/${category.category_number}`}>Edit</Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(category)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesTable;

import {useState} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";

const ProductsTable = ({products}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedProduct, setSelectedProduct] = useState(null);

    const sortedProducts = products
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

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    const handleDelete = async (product) => {
        const {data, error} = await supabase
            .from('product')
            .delete()
            .eq('id_product', product.id_product)

        if (error) {
            console.log(error)
        } else {
            console.log(data)
            window.location.reload();
        }
    }

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-product" className="link-create-new">Create New Product</Link>
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
                        <td style={{cursor: 'pointer', fontWeight: 'bold'}}
                            onClick={() => handleRowClick(product)}>{product.id_product}.
                        </td>
                        <td>{product.category_number}</td>
                        <td>{product.product_name}</td>
                        <td>{product.characteristics}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={'/' + product.id_product}>
                                    Edit
                                </Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(product)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/*{selectedProduct && <Popup employee={selectedProduct} onClose={handleClosePopup}/>}*/}
        </div>
    );
}

export default ProductsTable;

import {useState, useEffect} from "react";
import '../styles/employee-table.css';
import '../styles/employee-popup.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";

const StoreProductsTable = ({storeProducts}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [setSelectedStoreProduct] = useState(null);
    const [productNames, setProductNames] = useState({});
    const [showPromotionalOnly, setShowPromotionalOnly] = useState(false);
    const [showNonPromotionalOnly, setShowNonPromotionalOnly] = useState(false);
    const [selectedProductCharacteristics, setSelectedProductCharacteristics] = useState(null);
    const [showCharacteristicsPopup, setShowCharacteristicsPopup] = useState(false);
    const [searchUPC, setSearchUPC] = useState('');

    useEffect(() => {
        const fetchProductNames = async () => {
            const productIds = storeProducts.map(product => product.id_product);
            const {data, error} = await supabase
                .from('product')
                .select('id_product, product_name')
                .in('id_product', productIds);

            if (error) {
                console.error("Error fetching product names:", error.message);
            } else {
                const nameMap = data.reduce((acc, curr) => {
                    acc[curr.id_product] = curr.product_name;
                    return acc;
                }, {});
                setProductNames(nameMap);
            }
        };

        fetchProductNames();
    }, [storeProducts]);

    const sortedProducts = storeProducts
        .filter(storeProduct => {
            if (showPromotionalOnly && showNonPromotionalOnly) {
                return true;
            } else if (showPromotionalOnly) {
                return storeProduct.promotional_product;
            } else if (showNonPromotionalOnly) {
                return !storeProduct.promotional_product;
            } else {
                return true;
            }
        })
        .filter(storeProduct => {
            return storeProduct.upc.toLowerCase().includes(searchUPC.toLowerCase());
        })
        .sort((a, b) => {
            if (sortConfig.key !== null) {
                if (sortConfig.key === 'product_name') {
                    const productNameA = productNames[a.id_product];
                    const productNameB = productNames[b.id_product];
                    if (productNameA < productNameB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (productNameA > productNameB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                } else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
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

    const handleRowClick = (storeProduct) => {
        setSelectedStoreProduct(storeProduct);
    };

    const handleDelete = async (storeProduct) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;
        const {data, error} = await supabase
            .from('store_product')
            .delete()
            .eq('upc', storeProduct.upc);

        if (error) {
            console.error("Error deleting product:", error.message);
        } else {
            console.log(data);
            window.location.reload();
        }
    }

    const handleProductNameClick = async (storeProduct) => {
        const {data, error} = await supabase
            .from('product')
            .select('characteristics')
            .eq('id_product', storeProduct.id_product)
            .single();

        if (error) {
            console.error("Error fetching product characteristics:", error.message);
        } else {
            setSelectedProductCharacteristics(data.characteristics);
            setShowCharacteristicsPopup(true);
        }
    };

    return (
        <div>
            {showCharacteristicsPopup && (
                <div className="popup-char">
                    <div className="popup-content">
                        <span className="close-ch" onClick={() => setShowCharacteristicsPopup(false)}>&times;</span>
                        <h3>Product Characteristics</h3>
                        <p>{selectedProductCharacteristics}</p>
                    </div>
                </div>
            )}
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-store-product" className="link-create-new">Add product to store</Link>
                </div>
                <div className="search-box">
                    <label htmlFor="searchUPC">Search by UPC:</label>
                    <input
                        type="text"
                        value={searchUPC}
                        onChange={(e) => setSearchUPC(e.target.value)}
                    />
                </div>
                <div className="checkboxs">
                    <label>
                        <input
                            type="checkbox"
                            checked={showPromotionalOnly}
                            onChange={(e) => setShowPromotionalOnly(e.target.checked)}
                        />
                        Show promotional only
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showNonPromotionalOnly}
                            onChange={(e) => setShowNonPromotionalOnly(e.target.checked)}
                        />
                        Show non-promotional only
                    </label>
                </div>
            </div>
            <table className="product-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('upc')}>UPC</th>
                    <th onClick={() => requestSort('upc_prom')}>UPC prom</th>
                    <th onClick={() => requestSort('id_product')}>ID</th>
                    <th onClick={() => requestSort('product_name')}>Product Name</th>
                    <th onClick={() => requestSort('products_number')}>Products number</th>
                    <th onClick={() => requestSort('selling_price')}>Price</th>
                    <th onClick={() => requestSort('promotional_product')}>Promotional</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedProducts.map(storeProduct => {
                    const promotionalPrice = (storeProduct.selling_price * 0.8).toFixed(2);
                    const pdv = (storeProduct.selling_price * 0.2).toFixed(2);
                    return (
                        <tr key={storeProduct.upc}>
                            <td style={{fontWeight: 'bold'}} onClick={() => handleRowClick(storeProduct)}>
                                {storeProduct.upc}.
                            </td>
                            <td>{storeProduct.upc_prom ? storeProduct.upc_prom : '-'}</td>
                            <td>{storeProduct.id_product}</td>
                            <td style={{cursor: 'pointer'}}
                                onClick={() => handleProductNameClick(storeProduct)}>{productNames[storeProduct.id_product]}</td>
                            <td>{storeProduct.products_number}</td>
                            <td>{storeProduct.selling_price} (PDV: {pdv})</td>
                            <td>{storeProduct.promotional_product ? `yes: ${promotionalPrice}` : 'no'}</td>
                            <td>
                                <button className="edit-button">
                                    <Link to={`/store-products/${storeProduct.upc}`}>Edit</Link>
                                </button>
                                <button className="edit-button" onClick={() => handleDelete(storeProduct)}>Delete
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default StoreProductsTable;

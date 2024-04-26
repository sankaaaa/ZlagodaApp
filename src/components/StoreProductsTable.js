import {useState, useEffect} from "react";
import '../styles/employee-table.css';
import '../styles/employee-popup.css';
import {Link} from "react-router-dom";

const StoreProductsTable = ({storeProducts, setStoreProducts, userRole}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [productNames, setProductNames] = useState({});
    const [showPromotionalOnly, setShowPromotionalOnly] = useState(false);
    const [showNonPromotionalOnly, setShowNonPromotionalOnly] = useState(false);
    const [selectedProductCharacteristics, setSelectedProductCharacteristics] = useState(null);
    const [showCharacteristicsPopup, setShowCharacteristicsPopup] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        const fetchProductNames = async () => {
            try {
                const promises = storeProducts.map(async product => {
                    const response = await fetch(`http://localhost:8081/product/name/${product.id_product}`);
                    if (!response.ok) {
                        throw new Error('Error fetching product names');
                    }
                    const data = await response.json();
                    return {id_product: product.id_product, product_name: data[0]?.product_name};
                });
                const results = await Promise.all(promises);
                const nameMap = results.reduce((acc, curr) => {
                    acc[curr.id_product] = curr.product_name || '';
                    return acc;
                }, {});
                setProductNames(nameMap);
            } catch (error) {
                console.error("Error fetching product names:", error.message);
            }
        };

        fetchProductNames();
    }, [storeProducts]);

    const filteredProducts = storeProducts.filter(storeProduct => {
        const idProduct = storeProduct.id_product.toString();
        return (
            idProduct.toLowerCase().includes(searchInput.toLowerCase()) ||
            storeProduct.upc.toLowerCase().includes(searchInput.toLowerCase()) ||
            productNames[storeProduct.id_product].toLowerCase().includes(searchInput.toLowerCase())
        );
    });


    const sortedProducts = filteredProducts
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

    const handleDelete = async (storeProductId) => {
        const confirmed = window.confirm("Are you sure you want to delete this store product?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/store_product/${storeProductId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Could not delete store product due to integration reasons');
            }
            const updatedProducts = storeProducts.filter(sproduct => sproduct.upc !== storeProductId);
            setStoreProducts(updatedProducts);
        } catch (error) {
            console.error(error);
            if (error.message.includes("500")) {
                setFormError("product cannot be deleted due to integration reasons");
            } else {
                setFormError(error.message);
            }
        }
    }

    const handleProductNameClick = async (storeProduct) => {
        try {
            const response = await fetch(`http://localhost:8081/product/char/${storeProduct.id_product}`);
            if (!response.ok) {
                throw new Error('Error fetching product characteristics');
            }
            const data = await response.json();
            setSelectedProductCharacteristics(data.characteristics);
            setShowCharacteristicsPopup(true);
        } catch (error) {
            console.error("Error fetching product characteristics:", error.message);
        }
    };

    const handlePrint = () => {
        window.print();
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
                <div className="create-new-container" style={{display: userRole === "cashier" ? "none" : "block"}}>
                    {userRole === "manager" && (
                        <Link to="/create-store-product" className="link-create-new">Add product to store</Link>
                    )}
                </div>
                <div className="search-box">
                    <label htmlFor="searchInput">Search by UPC, ID or Product Name:</label>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
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
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
            {formError && <p className="error">{formError}</p>}
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
                            <td style={{fontWeight: 'bold'}}>
                                {storeProduct.upc}.
                            </td>
                            <td>{storeProduct.upc_prom ? storeProduct.upc_prom : '-'}</td>
                            <td>{storeProduct.id_product}</td>
                            <td style={{cursor: 'pointer'}}
                                onClick={() => handleProductNameClick(storeProduct)}>{productNames[storeProduct.id_product]}</td>
                            <td>{storeProduct.products_number}</td>
                            <td>{storeProduct.selling_price} (VAT: {pdv})</td>
                            <td>{storeProduct.promotional_product ? `yes: ${promotionalPrice}` : 'no'}</td>
                            <td>
                                {userRole === "manager" ? (
                                    <>
                                        <button className="edit-button">
                                            <Link to={`/store-products/${storeProduct.upc}`}>Edit</Link>
                                        </button>
                                        <button className="edit-button"
                                                onClick={() => handleDelete(storeProduct.upc)}>Delete
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
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default StoreProductsTable;

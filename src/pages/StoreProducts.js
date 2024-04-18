import {useEffect, useState} from 'react';
import '../styles/links-stuff.css';
import StoreProductsTable from "../components/StoreProductsTable";

const StoreProducts = () => {
    const [fetchError, setFetchError] = useState(null);
    const [storeProducts, setStoreProducts] = useState(null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
        const fetchStoreProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/store_product');
                if (!response.ok) {
                    throw new Error('Could not fetch store products');
                }
                const data = await response.json();
                setStoreProducts(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setStoreProducts(null);
                console.error(error);
            }
        };

        fetchStoreProducts();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {storeProducts && (
                <div>
                    <StoreProductsTable storeProducts={storeProducts} setStoreProducts={setStoreProducts}
                                        userRole={userRole}/>
                </div>
            )}
        </div>
    );
};

export default StoreProducts;
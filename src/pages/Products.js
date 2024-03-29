import { useEffect, useState } from 'react';
import ProductsTable from "../components/ProductsTable";

const Products = () => {
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/product');
                if (!response.ok) {
                    throw new Error('Could not fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setProducts(null);
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {products && (
                <div>
                    <ProductsTable products={products}/>
                </div>
            )}
        </div>
    );
};

export default Products;

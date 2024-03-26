import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components
import ProductsTable from "../components/ProductsTable";

//styles
import '../styles/links-stuff.css';

const Products = () => {
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const {data, error} = await supabase
                    .from('product')
                    .select();

                if (error) {
                    throw new Error('Could not fetch products');
                }

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
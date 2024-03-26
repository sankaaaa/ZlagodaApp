import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components
import { Link } from "react-router-dom";

//styles
import '../styles/links-stuff.css';
import ProductsTable from "../components/ProductsTable";
const Products = () => {
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
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
                    <ProductsTable products={products} />
                </div>
            )}
        </div>
    );
};

export default Products;
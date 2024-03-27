import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components

//styles
import '../styles/links-stuff.css';
import StoreProductsTable from "../components/StoreProductsTable";

const StoreProducts = () => {
    const [fetchError, setFetchError] = useState(null);
    const [storeProducts, setStoreProducts] = useState(null);

    useEffect(() => {
        const fetchStoreProducts = async () => {
            try {
                const {data, error} = await supabase
                    .from('store_product')
                    .select();

                if (error) {
                    throw new Error('Could not fetch store products');
                }

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
                    <StoreProductsTable storeProducts={storeProducts}/>
                </div>
            )}
        </div>
    );
};

export default StoreProducts;
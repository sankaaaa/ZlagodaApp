import {useState} from "react";
import {useNavigate} from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';

const CreateStoreProduct = () => {
    const navigate = useNavigate();
    const [upc, setUpc] = useState('');
    const [upc_prom, setUpcProm] = useState('');
    const [id_product, setIdProduct] = useState('');
    const [selling_price, setSellingPrice] = useState('');
    const [products_number, setProductsNumber] = useState('');
    const [promotional_product, setPromotionalProduct] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id_product || !upc || !selling_price || !products_number) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        if (parseFloat(selling_price) <= 0 || parseInt(products_number) <= 0) {
            setFormError("Selling price and products number should be greater than 0!");
            return;
        }

        const upcPromValue = upc_prom.trim() ? upc_prom : null;

        const {data: existingProducts, error: existingProductError} = await supabase
            .from('store_product')
            .select('upc')
            .eq('upc', upc);

        if (existingProductError) {
            console.error(existingProductError.message);
            setFormError("An error occurred while checking for existing product.");
            return;
        }

        if (existingProducts.length > 0) {
            setFormError("Product with the same UPC already exists in the table!");
            return;
        }

        const {data: existingStoreProducts, error: existingStoreProductError} = await supabase
            .from('store_product')
            .select('id_product')
            .eq('id_product', id_product);

        if (existingStoreProductError) {
            console.error(existingStoreProductError.message);
            setFormError("An error occurred while checking for existing store product.");
            return;
        }

        if (existingStoreProducts.length > 0) {
            setFormError("Product with the provided ID already exists in the store product list.");
            return;
        }

        const {data, error} = await supabase
            .from('store_product')
            .insert([{
                id_product, upc, upc_prom: upcPromValue, selling_price, products_number, promotional_product
            }]);

        if (error) {
            console.log(error);
            if (error.code === '23503' && error.details.includes('id_product')) {
                setFormError("Product with the provided ID does not exist in the product list.");
            } else {
                setFormError("An error occurred while inserting the product.");
            }
        } else {
            console.log(data);
            setFormError(null);
            navigate('/store-products');
        }
    }

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="upc">UPC:</label>
                <input
                    type="text"
                    id="upc"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                />
                <label htmlFor="upc_prom">UPC Prom:</label>
                <input
                    type="text"
                    id="upc_prom"
                    value={upc_prom}
                    onChange={(e) => setUpcProm(e.target.value)}
                />
                <label htmlFor="id_product">ID Product:</label>
                <input
                    type="text"
                    id="id_product"
                    value={id_product}
                    onChange={(e) => setIdProduct(e.target.value)}
                />
                <label htmlFor="selling_price">Selling Price:</label>
                <input
                    type="text"
                    id="selling_price"
                    value={selling_price}
                    onChange={(e) => setSellingPrice(e.target.value)}
                />
                <label htmlFor="products_number">Products Number:</label>
                <input
                    type="text"
                    id="products_number"
                    value={products_number}
                    onChange={(e) => setProductsNumber(e.target.value)}
                />
                <label htmlFor="promotional_product">Promotional Product:</label>
                <input
                    type="checkbox"
                    id="promotional_product"
                    checked={promotional_product}
                    onChange={(e) => setPromotionalProduct(e.target.checked)}
                />
                <button>Add Product to Store</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
};

export default CreateStoreProduct;

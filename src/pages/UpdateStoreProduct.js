import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const UpdateStoreProduct = () => {
    const { upc } = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    const [upc_prom, setUpcProm] = useState('');
    const [selling_price, setSellingPrice] = useState('');
    const [products_number, setProductsNumber] = useState('');
    const [promotional_product, setPromotionalProduct] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selling_price || !products_number) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        if (parseFloat(selling_price) <= 0 || parseInt(products_number) <= 0) {
            setFormError("Selling price and products number should be greater than 0!");
            return;
        }

        const upcPromValue = upc_prom ? upc_prom.trim() : null; // Перевірка на null перед викликом trim()

        const { data, error } = await supabase
            .from('store_product')
            .update({
                selling_price,
                products_number,
                promotional_product,
                upc_prom: upcPromValue
            })
            .eq('upc', upc);

        if (error) {
            console.log(error);
            setFormError('Please fill in all fields correctly!');
        } else {
            setFormError(null);
            navigate('/store-products');
        }
    };


    useEffect(() => {
        const fetchStoreProduct = async () => {
            const { data, error } = await supabase
                .from('store_product')
                .select()
                .eq('upc', upc)
                .single();

            if (error) {
                navigate('/store_product', { replace: true });
            } else {
                setUpcProm(data.upc_prom);
                setSellingPrice(data.selling_price);
                setProductsNumber(data.products_number);
                setPromotionalProduct(data.promotional_product);
            }
        };
        fetchStoreProduct();
    }, [upc, navigate]);

    return (
        <div className="page update">
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="upc_prom">UPC prom:</label>
                <input
                    type="text"
                    id="upc_prom"
                    value={upc_prom}
                    onChange={(e) => setUpcProm(e.target.value)}
                />
                <label htmlFor="selling_price">Selling price:</label>
                <input
                    type="number"
                    id="selling_price"
                    value={selling_price}
                    onChange={(e) => setSellingPrice(e.target.value)}
                />
                <label htmlFor="products_number">Products number:</label>
                <input
                    type="text"
                    id="products_number"
                    value={products_number}
                    onChange={(e) => setProductsNumber(e.target.value)}
                />
                <label htmlFor="promotional_product">Promotional product:</label>
                <input
                    type="checkbox"
                    id="promotional_product"
                    checked={promotional_product}
                    onChange={(e) => setPromotionalProduct(e.target.checked)}
                />
                <button>Update product in store</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateStoreProduct;

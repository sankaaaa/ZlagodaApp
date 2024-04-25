import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';

const CreateStoreProduct = () => {
    const navigate = useNavigate();
    const [upc, setUpc] = useState('');
    const [id_product, setIdProduct] = useState('');
    const [selling_price, setSellingPrice] = useState('');
    const [products_number, setProductsNumber] = useState('');
    const [formError, setFormError] = useState(null);
    const [productOptions, setProductOptions] = useState([]);

    useEffect(() => {
        const fetchProductOptions = async () => {
            try {
                const response = await fetch('http://localhost:8081/product/p');
                if (!response.ok) {
                    throw new Error('Failed to fetch product options');
                }
                const data = await response.json();
                setProductOptions(data.map(item => `${item.id_product}, ${item.product_name}`));
            } catch (error) {
                console.error('Error fetching product options:', error.message);
                setFormError('An error occurred while fetching product options');
            }
        };

        fetchProductOptions();
    }, []);

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

        let upcPromValue = null;

        const {data: promotionalProduct, error: promotionalProductError} = await supabase
            .from('store_product')
            .select('upc')
            .eq('id_product', id_product)
            .eq('promotional_product', true);

        if (promotionalProductError) {
            console.error(promotionalProductError);
            setFormError("An error occurred while checking for promotional product.");
            return;
        }

        if (promotionalProduct && promotionalProduct.length > 0) {
            upcPromValue = promotionalProduct[0].upc;
        }

        try {
            const {data: existingProducts, error: existingProductError} = await supabase
                .from('store_product')
                .select('id_product, promotional_product')
                .eq('id_product', id_product);

            if (existingProductError) {
                console.error(existingProductError.message);
                setFormError("An error occurred while checking for existing product.");
                return;
            }

            if (existingProducts.length > 0) {
                const hasNonPromotionalProduct = existingProducts.some(product => !product.promotional_product);
                if (hasNonPromotionalProduct) {
                    setFormError("A non-promotional product with the same ID already exists in the store product list!");
                    return;
                } else {
                    const {data: existingUPCs, error: existingUPCsError} = await supabase
                        .from('store_product')
                        .select('upc')
                        .eq('upc', upc);

                    if (existingUPCsError) {
                        console.error(existingUPCsError.message);
                        setFormError("An error occurred while checking for existing UPCs.");
                        return;
                    }

                    if (existingUPCs && existingUPCs.length > 0) {
                        setFormError("Product with the same UPC already exists in the table!");
                        return;
                    }

                    const {data: insertedData, error: insertError} = await supabase
                        .from('store_product')
                        .insert({
                            id_product,
                            upc,
                            upc_prom: upcPromValue,
                            selling_price,
                            products_number,
                            promotional_product: false
                        });

                    if (insertError) {
                        throw new Error("An error occurred while inserting the product.");
                    }

                    console.log(insertedData);
                    setFormError(null);
                    navigate('/store-products');
                }
            }
        } catch (error) {
            console.error(error);
            setFormError("An error occurred while inserting the product.");
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
                <label htmlFor="id_product">ID Product:</label>
                <select
                    id="id_product"
                    value={id_product}
                    onChange={(e) => setIdProduct(e.target.value)}
                >
                    <option value="">Select Product ID</option>
                    {productOptions.map((option, index) => (
                        <option key={index} value={option.split(',')[0]}>{option}</option>
                    ))}
                </select>
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
                <button>Add Product to Store</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
};

export default CreateStoreProduct;

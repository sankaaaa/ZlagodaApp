import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import supabase from "../config/supabaseClient";

const UpdateStoreProduct = () => {
    const {upc} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    const [existingPromotionalProduct, setExistingPromotionalProduct] = useState(false);
    const [id_product, setIdProduct] = useState(null);
    const [upc_prom, setUpcProm] = useState('');
    const [selling_price, setSellingPrice] = useState('');
    const [products_number, setProductsNumber] = useState('');
    const [promotional_product, setPromotionalProduct] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);

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

        if (showCheckbox && promotional_product && existingPromotionalProduct) {
            setFormError("A promotional product with the same ID already exists in the store product list!");
            return;
        }

        const upcPromValue = upc_prom ? upc_prom.trim() : null;

        try {
            const {data, error} = await supabase
                .from('store_product')
                .update({
                    selling_price,
                    products_number,
                    promotional_product,
                    upc_prom: upcPromValue
                })
                .eq('upc', upc);

            if (error) {
                throw new Error(error.message);
            } else {
                setFormError(null);
                navigate('/store-products');
            }
        } catch (error) {
            console.error(error);
            setFormError("An error occurred while updating the store product.");
        }
    };

    useEffect(() => {
        const fetchProductId = async () => {
            try {
                const response = await fetch(`http://localhost:8081/store_product/l/${upc}`);
                if (!response.ok) {
                    throw new Error("5An error occurred while checking for existing promotional product.");
                }
                const responseData = await response.json();
                const productId = parseInt(responseData.id_product);
                console.log(productId);
                setIdProduct(productId);
            } catch (error) {
                console.error(error);
                setFormError("4An error occurred while checking for existing promotional product.");
            }
        };

        fetchProductId();
    }, [upc]);

    useEffect(() => {
        const fetchStoreProduct = async () => {
            if (id_product !== null) {
                try {
                    const response = await fetch(`http://localhost:8081/store_product/lol/${id_product}`);
                    if (!response.ok) {
                        throw new Error("3An error occurred while checking for existing promotional product.");
                    }
                    const responseData = await response.json();
                    if (responseData !== null) {
                        setExistingPromotionalProduct(true);
                    } else {
                        const {data, error} = await supabase
                            .from('store_product')
                            .update({
                                selling_price,
                                products_number,
                                promotional_product,
                                upc_prom: upc_prom.trim()
                            })
                            .eq('upc', upc);

                        if (error) {
                            throw new Error("2An error occurred while updating the store product.");
                        } else {
                            setFormError(null);
                            navigate('/store-products');
                        }
                    }
                } catch (error) {
                    setFormError("");
                }
            }
        };

        fetchStoreProduct();
    }, [id_product, navigate, upc, selling_price, products_number, promotional_product, upc_prom]);

    useEffect(() => {
        const fetchStoreProduct = async () => {
            const {data, error} = await supabase
                .from('store_product')
                .select()
                .eq('upc', upc)
                .single();

            if (error) {
                navigate('/store_product', {replace: true});
            } else {
                setUpcProm(data.upc_prom);
                setSellingPrice(data.selling_price);
                setProductsNumber(data.products_number);
                setPromotionalProduct(data.promotional_product);
                setShowCheckbox(!data.promotional_product);
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
                {showCheckbox && (
                    <div>
                        <label htmlFor="promotional_product">Promotional product:</label>
                        <input
                            type="checkbox"
                            id="promotional_product"
                            checked={promotional_product}
                            onChange={(e) => setPromotionalProduct(e.target.checked)}
                        />
                    </div>
                )}
                <button>Update product in store</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateStoreProduct;

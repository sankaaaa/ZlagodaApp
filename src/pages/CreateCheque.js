import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';

const CreateCheque = () => {
    const navigate = useNavigate();
    const [check_number, setCheckNumber] = useState('');
    const [id_employee, setIdEmployee] = useState('');
    const [card_number, setCardNumber] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([{product: '', quantity: 1}]);
    const [totalSum, setTotalSum] = useState(0);
    const [formError, setFormError] = useState(null);
    const [cashiers, setCashiers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState({});

    useEffect(() => {
        async function fetchCashiers() {
            try {
                const {data, error} = await supabase
                    .from('employee')
                    .select('id_employee')
                    .eq('empl_role', 'cashier');

                if (error)
                    throw error;

                setCashiers(data.map(cashier => cashier.id_employee));
            } catch (error) {
                console.error('Error fetching cashiers:', error.message);
            }
        }

        fetchCashiers();
    }, []);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const {data, error} = await supabase
                    .from('customer_card')
                    .select('card_number');

                if (error)
                    throw error;

                setCustomers(data.map(customer => customer.card_number));
            } catch (error) {
                console.error('Error fetching customers:', error.message);
            }
        }

        fetchCustomers();
    }, []);

    useEffect(() => {
        async function fetchProdNames() {
            try {
                const {data, error} = await supabase
                    .from('product')
                    .select('id_product, product_name');

                if (error)
                    throw error;

                const productNamesObject = {};
                data.forEach(product => {
                    productNamesObject[product.id_product] = product.product_name;
                });
                setProductNames(productNamesObject);
            } catch (error) {
                console.error('Error fetching product names:', error.message);
            }
        }

        fetchProdNames();
    }, []);


    useEffect(() => {
        async function fetchProducts() {
            try {
                const {data, error} = await supabase
                    .from('store_product')
                    .select('id_product');

                if (error)
                    throw error;

                setProducts(data.map(product => product.id_product));
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        }

        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProducts.length > 0 && products.length > 0) {
            const fetchProductInfo = async () => {
                try {
                    const productData = await Promise.all(selectedProducts.map(async (product) => {
                        const {data: productInfo, error} = await supabase
                            .from('store_product')
                            .select('selling_price, promotional_product')
                            .eq('id_product', product.product)
                            .single();
                        if (error)
                            throw error;

                        return productInfo;
                    }));

                    const sum = productData.reduce((acc, curr, index) => {
                        const price = curr.promotional_product ? curr.selling_price * 0.8 : curr.selling_price;
                        return acc + price * selectedProducts[index].quantity;
                    }, 0);
                    setTotalSum(parseFloat(sum.toFixed(2)));
                } catch (error) {
                    console.error('Error fetching product price:', error.message);
                }
            };

            fetchProductInfo();
        }
    }, [selectedProducts, products]);


    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, {product: '', quantity: 1}]);
    };

    const handleProductChange = (index, field, value) => {
        if (field === 'quantity') {
            if (value < 0)
                value = 0;
        } else if (field === 'price') {
            if (value < 0)
                value = 0;
        }

        const updatedProducts = [...selectedProducts];
        updatedProducts[index][field] = value;
        setSelectedProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!check_number || !id_employee || !card_number || totalSum === 0) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const {data, error} = await supabase
                .from('cheque')
                .insert([{
                    check_number,
                    id_employee,
                    card_number,
                    print_date: formattedDate,
                    sum_total: totalSum,
                    vat: totalSum * 0.2,
                }]);

            if (error)
                throw error;

            console.log(data);
            setFormError(null);
            navigate('/cheques');
        } catch (error) {
            console.error('Error inserting cheque:', error.message);
            setFormError("An error occurred while inserting the cheque.");
        }
    }
    const handleRemoveProduct = (indexToRemove) => {
        setSelectedProducts(prevProducts => {
            const updatedProducts = prevProducts.filter((_, index) => index !== indexToRemove);
            if (updatedProducts.length === 0)
                setTotalSum(0);
            return updatedProducts;
        });
    };

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <div className="select-wrapper">
                    <label htmlFor="check_number">Cheque number:</label>
                    <input
                        type="text"
                        id="check_number"
                        value={check_number}
                        onChange={(e) => setCheckNumber(e.target.value)}
                    />
                </div>

                <div className="select-wrapper">
                    <label htmlFor="id_employee">ID employee:</label>
                    <select
                        id="id_employee"
                        value={id_employee}
                        onChange={(e) => setIdEmployee(e.target.value)}
                    >
                        <option value="">Select cashier</option>
                        {cashiers.map(cashier => (
                            <option key={cashier} value={cashier}>{cashier}</option>
                        ))}
                    </select>
                </div>

                <div className="select-wrapper">
                    <label htmlFor="card_number">Card number:</label>
                    <select
                        id="card_number"
                        value={card_number}
                        onChange={(e) => setCardNumber(e.target.value)}
                    >
                        <option value="">Select customer card</option>
                        {customers.map(customer => (
                            <option key={customer} value={customer}>{customer}</option>
                        ))}
                    </select>
                </div>

                {selectedProducts.map((product, index) => (
                    <div key={index}>
                        <div className="select-wrapper p">
                            <label htmlFor={`product_${index}`}>Product:</label>
                            <select
                                id={`product_${index}`}
                                value={product.product}
                                onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                            >
                                <option value="">Select a product</option>
                                {products.map(id => (
                                    <option key={id} value={id}>{productNames[id]}</option>
                                ))}
                            </select>
                            <label htmlFor={`quantity_${index}`}>Quantity:</label>
                            <input className="q"
                                   type="number"
                                   id={`quantity_${index}`}
                                   value={product.quantity}
                                   onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            />
                            <button type="button" className="rem-b" onClick={() => handleRemoveProduct(index)}>✖️
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={handleAddProduct} className="add-prod-b">Add Product</button>
                <div className="select-wrapper">
                    <label htmlFor="total_sum">Total Sum:</label>
                    <input
                        type="text"
                        id="total_sum"
                        value={totalSum}
                        readOnly
                    />
                </div>
                <button>Add Cheque</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateCheque;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';

const CreateCheque = () => {
    const navigate = useNavigate();
    const [check_number, setCheckNumber] = useState('');
    const [id_employee, setIdEmployee] = useState('');
    const [card_number, setCardNumber] = useState('');
    const [print_date, setPrintDate] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [totalSum, setTotalSum] = useState(0);
    const [formError, setFormError] = useState(null);
    const [cashiers, setCashiers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchCashiers() {
            try {
                const { data, error } = await supabase
                    .from('employee')
                    .select('id_employee')
                    .eq('empl_role', 'cashier');

                if (error) {
                    throw error;
                }

                setCashiers(data.map(cashier => cashier.id_employee));
            } catch (error) {
                console.error('Error fetching cashiers:', error.message);
            }
        }

        fetchCashiers();
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('store_product')
                    .select('id_product');

                if (error) {
                    throw error;
                }

                setProducts(data.map(product => product.id_product));
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        }

        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct && quantity) {
            async function fetchProductPrice() {
                try {
                    const { data: productData, error } = await supabase
                        .from('store_product')
                        .select('selling_price')
                        .eq('id_product', selectedProduct);

                    if (error) {
                        throw error;
                    }

                    const price = productData[0].selling_price;
                    setTotalSum(parseFloat(price) * parseInt(quantity));
                } catch (error) {
                    console.error('Error fetching product price:', error.message);
                }
            }

            fetchProductPrice();
        }
    }, [selectedProduct, quantity]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!check_number || !id_employee || !card_number || !print_date || !totalSum) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('cheque')
                .insert([{
                    check_number,
                    id_employee,
                    card_number,
                    print_date,
                    sum_total: totalSum,
                    vat: totalSum * 0.2,
                }]);

            if (error) {
                throw error;
            }

            console.log(data);
            setFormError(null);
            navigate('/cheques');
        } catch (error) {
            console.error('Error inserting cheque:', error.message);
            setFormError("An error occurred while inserting the cheque.");
        }
    }

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="check_number">Cheque number:</label>
                <input
                    type="text"
                    id="check_number"
                    value={check_number}
                    onChange={(e) => setCheckNumber(e.target.value)}
                />
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
                <label htmlFor="card_number">Card number:</label>
                <input
                    type="text"
                    id="card_number"
                    value={card_number}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <label htmlFor="print_date">Print date:</label>
                <input
                    type="datetime-local"
                    id="print_date"
                    value={print_date}
                    onChange={(e) => setPrintDate(e.target.value)}
                />
                <label htmlFor="selected_product">Select a product:</label>
                <select
                    id="selected_product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                >
                    <option value="">Select a product</option>
                    {products.map(product => (
                        <option key={product} value={product}>{product}</option>
                    ))}
                </select>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <label htmlFor="total_sum">Total Sum:</label>
                <input
                    type="text"
                    id="total_sum"
                    value={totalSum}
                    readOnly
                />
                <button>Add Cheque</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateCheque;

import React, {useEffect, useState} from "react";
import supabase from "../config/supabaseClient";
import '../styles/employee-popup.css';

const Popup = ({cheque, onClose}) => {
    const [chequeProducts, setChequeProducts] = useState([]);
    const [employeeSurname, setEmployeeSurname] = useState('');
    const [customerSurname, setCustomerSurname] = useState('');

    useEffect(() => {
        fetchChequeProducts(cheque.check_number);
        fetchEmployeeSurname(cheque.id_employee);
    }, [cheque.check_number, cheque.id_employee]);

    const fetchChequeProducts = async (chequeNumber) => {
        try {
            const {data, error} = await supabase
                .from('sale')
                .select()
                .eq('check_number', chequeNumber);

            if (error) {
                console.error('Error while fetching cheque products:', error.message);
            } else {
                const productsWithNames = await Promise.all(data.map(async (item) => {
                    const {data: productData, error: productError} = await supabase
                        .from('store_product')
                        .select('id_product, selling_price, promotional_product')
                        .eq('upc', item.upc)
                        .single();

                    if (productError) {
                        console.error('Error fetching store_product:', productError.message);
                        return {...item, productName: "Unknown"};
                    } else {
                        const {data: productDetails, error: detailsError} = await supabase
                            .from('product')
                            .select('product_name')
                            .eq('id_product', productData.id_product)
                            .single();

                        if (detailsError) {
                            console.error('Error fetching product details:', detailsError.message);
                            return {...item, productName: "Unknown"};
                        } else {
                            const price = productData.promotional_product ? productData.selling_price * 0.8 : productData.selling_price;
                            return {...item, productName: productDetails.product_name, price};
                        }
                    }
                }));

                setChequeProducts(productsWithNames);
            }
        } catch (error) {
            console.error('Error fetching cheque products:', error.message);
        }
    };
    useEffect(() => {
        fetchCustomerSurname(cheque.card_number);
    }, [cheque.card_number]);

    const fetchCustomerSurname = async (cardNumber) => {
        try {
            const {data, error} = await supabase
                .from('customer_card')
                .select('cust_surname')
                .eq('card_number', cardNumber)
                .single();

            if (error) {
                throw error;
            }

            setCustomerSurname(data.cust_surname || 'unknown');
        } catch (error) {
            console.error('Error fetching customer surname:', error.message);
            setCustomerSurname('unknown');
        }
    };

    const fetchEmployeeSurname = async (employeeId) => {
        try {
            const {data, error} = await supabase
                .from('employee')
                .select('empl_surname')
                .eq('id_employee', employeeId)
                .single();

            if (error) {
                throw error;
            }

            setEmployeeSurname(data.empl_surname || 'unknown');
        } catch (error) {
            console.error('Error fetching employee surname:', error.message);
            setEmployeeSurname('unknown');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-ch" onClick={onClose}>&times;</span>
                <h2>Cheque Details</h2>
                <p><strong>Cheque Number:</strong> {cheque.check_number}</p>
                <p><strong>ID employee:</strong> {cheque.id_employee}, {employeeSurname}</p>
                <p><strong>Card number:</strong> {cheque.card_number}, {customerSurname}</p>
                <p><strong>Print date:</strong> {new Date(cheque.print_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }).replace(/\//g, '.').replace(',', '')}</p>
                <p><strong>Sum total:</strong> {cheque.sum_total}</p>
                <p><strong>VAT:</strong> {cheque.vat}</p>
                <h3>Products</h3>
                <ul>
                    {chequeProducts.map((item, index) => (
                        <li key={index}>
                            Product: {item.productName}, Quantity: {item.product_number}, Price: {item.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
        </div>
    );
};

export default Popup;

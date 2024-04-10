import React, {useEffect, useState} from "react";
import supabase from "../config/supabaseClient";
import '../styles/employee-popup.css';

const Popup = ({cheque, onClose}) => {
    const [chequeProducts, setChequeProducts] = useState([]);

    useEffect(() => {
        fetchChequeProducts(cheque.check_number);
    }, [cheque.check_number]);

    const fetchChequeProducts = async (chequeNumber) => {
        try {
            const {data, error} = await supabase
                .from('sale')
                .select()
                .eq('check_number', chequeNumber);

            if (error) {
                console.error('Error fetching cheque products:', error.message);
            } else {
                const productsWithNames = await Promise.all(data.map(async (item) => {
                    const {data: productData, error: productError} = await supabase
                        .from('store_product')
                        .select('id_product')
                        .eq('upc', item.upc)
                        .single();

                    if (productError) {
                        console.error('Error fetching store_product:', productError.message);
                        return {...item, productName: "Unknown"}; // Set a default name
                    } else {
                        const {data: productDetails, error: detailsError} = await supabase
                            .from('product')
                            .select('product_name')
                            .eq('id_product', productData.id_product)
                            .single();

                        if (detailsError) {
                            console.error('Error fetching product details:', detailsError.message);
                            return {...item, productName: "Unknown"}; // Set a default name
                        } else {
                            return {...item, productName: productDetails.product_name};
                        }
                    }
                }));

                setChequeProducts(productsWithNames);
            }
        } catch (error) {
            console.error('Error fetching cheque products:', error.message);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-ch" onClick={onClose}>&times;</span>
                <h2>Cheque Details</h2>
                <p><strong>Cheque Number:</strong> {cheque.check_number}</p>
                <p><strong>ID employee:</strong> {cheque.id_employee}</p>
                <p><strong>Card number:</strong> {cheque.card_number}</p>
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
                            Product: {item.productName}, Quantity: {item.product_number}, Price: {item.selling_price}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Popup;

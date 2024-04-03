import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const ChecksPopup = ({ check, onClose }) => {
    // const [purchasedItems, setPurchasedItems] = useState([]);
    //
    // useEffect(() => {
    //     const fetchPurchasedItems = async () => {
    //         try {
    //             // Отримуємо дані з таблиці store_product
    //             const { data: storeProducts, error: productsError } = await supabase
    //                 .from('store_product')
    //                 .select('*');
    //
    //             if (productsError) {
    //                 throw productsError;
    //             }
    //
    //             // Генеруємо список куплених товарів на основі даних з таблиці store_product
    //             const generatedItems = generatePurchasedItems(storeProducts);
    //
    //             setPurchasedItems(generatedItems);
    //         } catch (error) {
    //             console.error("Error fetching purchased items:", error.message);
    //         }
    //     };
    //
    //     fetchPurchasedItems();
    // }, []);
    //
    // // Функція для генерації списку куплених товарів
    // const generatePurchasedItems = (storeProducts) => {
    //     const purchasedItems = [];
    //
    //     // Проходимося по кожному товару у чеку і шукаємо відповідний запис у таблиці store_product
    //     check.items.forEach(checkItem => {
    //         const storeProduct = storeProducts.find(product => product.id_product === checkItem.id_product);
    //
    //         if (storeProduct) {
    //             purchasedItems.push({
    //                 id_product: storeProduct.id_product,
    //                 product_name: storeProduct.product_name,
    //                 quantity: checkItem.quantity,
    //                 selling_price: storeProduct.selling_price,
    //                 total_price: checkItem.quantity * storeProduct.selling_price
    //             });
    //         }
    //     });
    //
    //     return purchasedItems;
    // };
    //
    // return (
    //     <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxHeight: '80%', overflowY: 'auto' }}>
    //         <div style={{ maxHeight: '100%' }}>
    //             <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '20px', color: '#888' }} onClick={onClose}>&times;</span>
    //             <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Check Details</h2>
    //             <p><strong>Check Number:</strong> {check.check_number}</p>
    //             <p><strong>ID Employee:</strong> {check.id_employee}</p>
    //             <p><strong>Card Number:</strong> {check.card_number}</p>
    //             <p><strong>Print Date:</strong> {check.print_date}</p>
    //             <p><strong>Sum Total:</strong> {check.sum_total}</p>
    //             <p><strong>VAT:</strong> {check.vat}</p>
    //             <h3>Purchased Items:</h3>
    //             <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
    //                 {purchasedItems.map((item, index) => (
    //                     <li key={index} style={{ marginBottom: '15px' }}>
    //                         <p><strong>Product ID:</strong> {item.id_product}</p>
    //                         <p><strong>Product Name:</strong> {item.product_name}</p>
    //                         <p><strong>Quantity:</strong> {item.quantity}</p>
    //                         <p><strong>Price per Item:</strong> {item.selling_price}</p>
    //                         <p><strong>Total Price:</strong> {item.total_price}</p>
    //                     </li>
    //                 ))}
    //             </ul>
    //         </div>
    //     </div>
    // );
};

export default ChecksPopup;

import '../styles/employee-popup.css';

const PopupCust = ({customer, onClose}) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Customer Details</h2>
                <p><strong>Card number:</strong> {customer.card_number}</p>
                <p><strong>Surname:</strong> {customer.cust_surname}</p>
                <p><strong>Name:</strong> {customer.cust_name}</p>
                <p><strong>Patronymic:</strong> {customer.cust_patronymic}</p>
                <p><strong>Phone Number:</strong> {customer.phone_number}</p>
                <p><strong>City:</strong> {customer.city}</p>
                <p><strong>Street:</strong> {customer.street}</p>
                <p><strong>Zip-code:</strong> {customer.zip_code}</p>
                <p><strong>Percent:</strong> {customer.percent}</p>
            </div>
        </div>
    );
}

export default PopupCust;

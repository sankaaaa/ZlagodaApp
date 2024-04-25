import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/create-form.css';

const CreateCustomer = () => {
    const navigate = useNavigate();
    const [card_number, setCardNumber] = useState('');
    const [cust_surname, setCustSurname] = useState('');
    const [cust_name, setCustName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip_code, setZipCode] = useState('');
    const [percent, setPercent] = useState('');

    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPhoneNumberValid = phone_number.length === 13 && /^\+?[0-9]{12}$/.test(phone_number);

        if (!isPhoneNumberValid) {
            setFormError("Phone number must be exactly 13 characters!");
            return;
        }

        if (!card_number || !cust_surname || !cust_name || !phone_number || !city || !street || !zip_code || !percent) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const existingCustomersResponse = await fetch(`http://localhost:8081/customer_card/${card_number}`);
        if (!existingCustomersResponse.ok) {
            console.error("Error checking for existing customer");
            setFormError("An error occurred while checking for existing customer.");
            return;
        }

        const existingCustomers = await existingCustomersResponse.json();
        if (existingCustomers.length > 0) {
            setFormError("Customer with the same card number already exists in the table!");
            return;
        }

        try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    card_number,
                    cust_surname,
                    cust_name,
                    phone_number,
                    city,
                    street,
                    zip_code,
                    percent
                })
            };

            const addResponse = await fetch('http://localhost:8081/customer_card', requestOptions);
            if (!addResponse.ok) {
                throw new Error('Error adding customer');
            }

            navigate('/customers');
        } catch (error) {
            console.error(error);
            setFormError("Error adding customer");
        }
    }

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="card_number">Card number:</label>
                <input
                    type="text"
                    id="card_number"
                    value={card_number}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
                <label htmlFor="cust_surname">Surname:</label>
                <input
                    type="text"
                    id="cust_surname"
                    value={cust_surname}
                    onChange={(e) => setCustSurname(e.target.value)}
                />
                <label htmlFor="cust_name">Name:</label>
                <input
                    type="text"
                    id="cust_name"
                    value={cust_name}
                    onChange={(e) => setCustName(e.target.value)}
                />
                <label htmlFor="phone_number">Phone number:</label>
                <input
                    type="tel"
                    id="phone_number"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <label htmlFor="street">Street:</label>
                <input
                    type="text"
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
                <label htmlFor="zip_code">Zip-code:</label>
                <input
                    type="text"
                    id="zip_code"
                    value={zip_code}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                <label htmlFor="percent">Percent:</label>
                <input
                    type="number"
                    id="percent"
                    value={percent}
                    onChange={(e) => {
                        const newPercent = e.target.value <= 99 ? e.target.value : 99;
                        setPercent(newPercent);
                    }}
                    min={0}
                    max={99}
                />
                <button>Add Customer</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateCustomer
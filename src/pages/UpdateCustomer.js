import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";
const UpdateCustomer = () => {
    const {card_number} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    const [cust_surname, setCustSurname] = useState('');
    const [cust_name, setCustName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip_code, setZipCode] = useState('');
    const [percent, setPercent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!card_number || !cust_surname || !cust_name || !phone_number || !city || !street || !zip_code || !percent) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const isPhoneNumberValid = /^\+?[0-9]{1,12}$/.test(phone_number);

        if (!isPhoneNumberValid) {
            setFormError("Please enter a valid phone number!");
            return;
        }

        const response = await fetch(`http://localhost:8081/customer_card/${card_number}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cust_surname, cust_name, phone_number, city, street, zip_code, percent
            })
        });

        if (response.ok) {
            navigate('/customers');
        } else {
            setFormError('Error updating customer');
        }
    };

    useEffect(() => {
        const fetchCustomer = async () => {
            const response = await fetch(`http://localhost:8081/customer_card/${card_number}`);
            if (response.ok) {
                const [data] = await response.json();
                setCustSurname(data.cust_surname);
                setCustName(data.cust_name);
                setPhoneNumber(data.phone_number);
                setCity(data.city);
                setStreet(data.street);
                setZipCode(data.zip_code);
                setPercent(data.percent);
            } else {
                navigate('/customers');
            }
        };
        fetchCustomer();
    }, [card_number, navigate]);

    return (
        <div className="page update">
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
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
                    type="text"
                    id="percent"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                />
                <button>Update customer</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateCustomer;

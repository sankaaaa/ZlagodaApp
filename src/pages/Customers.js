import {useEffect, useState} from 'react';
import '../styles/links-stuff.css';
import CustomersTable from "../components/CustomersTable";

const Customers = () => {
    const [fetchError, setFetchError] = useState(null);
    const [customers, setCustomers] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8081/customer_card');
                if (!response.ok) {
                    throw new Error('Could not fetch customers');
                }
                const data = await response.json();
                setCustomers(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCustomers(null);
                console.error(error);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {customers && (
                <div>
                    <CustomersTable customers={customers} setCustomers={setCustomers}/>
                </div>
            )}
        </div>
    );
};

export default Customers;
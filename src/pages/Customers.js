import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components

//styles
import '../styles/links-stuff.css';
import EmployeeTable from "../components/EmployeeTable";
import CustomersTable from "../components/CustomersTable";
const Customers = () => {
    const [fetchError, setFetchError] = useState(null);
    const [customers, setCustomers] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data, error } = await supabase
                    .from('customer_card')
                    .select();

                if (error) {
                    throw new Error('Could not fetch customers');
                }

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
                    <CustomersTable customers={customers} />
                </div>
            )}
        </div>
    );
};

export default Customers;
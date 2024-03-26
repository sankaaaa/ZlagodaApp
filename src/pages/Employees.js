import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components
import EmployeeTable from "../components/EmployeeTable";

//styles
import '../styles/links-stuff.css';
const Employees = () => {
    const [fetchError, setFetchError] = useState(null);
    const [employees, setEmployees] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data, error } = await supabase
                    .from('employee')
                    .select();

                if (error) {
                    throw new Error('Could not fetch employees');
                }

                setEmployees(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setEmployees(null);
                console.error(error);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {employees && (
                <div>
                    <EmployeeTable customers={employees} />
                </div>
            )}
        </div>
    );
};

export default Employees;
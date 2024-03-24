import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components
import { Link } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";

//styles
import '../styles/links-stuff.css';
const Home = () => {
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
                    <div className="create-new-container">
                        <Link to="/create" className="link-create-new">Create New Employee</Link>
                    </div>
                    <EmployeeTable employees={employees} />
                </div>
            )}
        </div>
    );
};

export default Home;
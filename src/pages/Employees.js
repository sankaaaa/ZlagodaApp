import {useEffect, useState} from 'react';
import EmployeeTable from "../components/EmployeeTable";
import '../styles/links-stuff.css';
const Employees = () => {
    const [fetchError, setFetchError] = useState(null);
    const [employees, setEmployees] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:8081/employee');
                if (!response.ok) {
                    throw new Error('Could not fetch employees');
                }
                const data = await response.json();
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
                    <EmployeeTable employees={employees} setEmployees={setEmployees}/>
                </div>
            )}
        </div>
    );
};

export default Employees;
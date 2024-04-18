import {useEffect, useState} from 'react';
import SalesTable from "../components/SalesTable";

const Sales = () => {
    const [fetchError, setFetchError] = useState(null);
    const [sales, setSales] = useState(null);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
        const fetchSales = async () => {
            try {
                const response = await fetch('http://localhost:8081/sale');
                if (!response.ok) {
                    throw new Error('Could not fetch sales');
                }
                const data = await response.json();
                setSales(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setSales(null);
                console.error(error);
            }
        };

        fetchSales();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {sales && (
                <div>
                    <SalesTable sales={sales} setSales={setSales} userRole={userRole}/>
                </div>
            )}
        </div>
    );
};

export default Sales;

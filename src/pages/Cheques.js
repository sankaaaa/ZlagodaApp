import {useEffect, useState} from 'react';
import ChequesTable from "../components/ChequesTable";

const Cheques = () => {
    const [fetchError, setFetchError] = useState(null);
    const [cheques, setCheques] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/cheque');
                if (!response.ok) {
                    throw new Error('Could not fetch cheques');
                }
                const data = await response.json();
                setCheques(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCheques(null);
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {cheques && (
                <div>
                    <ChequesTable cheques={cheques} setCheques={setCheques}/>
                </div>
            )}
        </div>
    );
};

export default Cheques;

import { useEffect, useState } from 'react';
const Checks = () => {
    const [fetchError, setFetchError] = useState(null);
    const [checks, setChecks] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8081/check');
                if (!response.ok) {
                    throw new Error('Could not fetch checks');
                }
                const data = await response.json();
                setChecks(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setChecks(null);
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {checks && (
                <div>
                    {/*<ProductsTable products={checks} setProducts={setChecks} />*/}
                </div>
            )}
        </div>
    );
};

export default Checks;

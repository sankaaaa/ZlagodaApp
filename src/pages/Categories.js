import {useEffect, useState} from 'react';
import '../styles/links-stuff.css';
import CategoriesTable from "../components/CategoriesTable";

const Categories = () => {
    const [fetchError, setFetchError] = useState(null);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8081/category');
                if (!response.ok)
                    throw new Error('Could not fetch categories');
                const data = await response.json();
                setCategories(data);
                setFetchError(null);
            } catch (error) {
                setFetchError(error.message);
                setCategories(null);
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="page home">
            {fetchError && <p>{fetchError}</p>}
            {categories && (
                <div>
                    <CategoriesTable categories={categories} setCategories={setCategories}/>
                </div>
            )}
        </div>
    );
};

export default Categories;
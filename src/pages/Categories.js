import supabase from "../config/supabaseClient";
import {useEffect, useState} from 'react';

//components

//styles
import '../styles/links-stuff.css';
import CategoriesTable from "../components/CategoriesTable";

const Categories = () => {
    const [fetchError, setFetchError] = useState(null);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const {data, error} = await supabase
                    .from('category')
                    .select();

                if (error) {
                    throw new Error('Could not fetch categories');
                }

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
                    <CategoriesTable categories={categories}/>
                </div>
            )}
        </div>
    );
};

export default Categories;
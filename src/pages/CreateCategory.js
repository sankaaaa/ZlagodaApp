import {useState} from "react";
import {useNavigate} from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';

const CreateCategory = () => {
    const navigate = useNavigate();
    const [category_number, setCategoryNumber] = useState('');
    const [category_name, setCatName] = useState('');

    const [formError, setFormError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d+$/.test(category_number)) {
            setFormError("Category number should contain only digits!");
            return;
        }

        if (!category_number || !category_name) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const { data: existingCat, error: existingCatError } = await supabase
            .from('category')
            .select('category_number')
            .eq('category_number', category_number);

        const { data: existingCatName, error: existingCatNameError } = await supabase
            .from('category')
            .select('category_name')
            .eq('category_name', category_name);


        if (existingCatError || existingCatNameError) {
            console.error(existingCatError.message);
            setFormError("An error occurred while checking for existing categories.");
            return;
        }

        if (existingCat.length > 0 ) {
            setFormError("Category with the same ID already exists in the table!");
            return;
        }

        if (existingCatName.length>0) {
            setFormError("Category with the same name already exists in the table!");
            return;
        }
        const {data, error} = await supabase
            .from('category')
            .insert([{
                category_number, category_name
            }]);

        if (error) {
            console.log(error);
            setFormError("Please set all form fields correctly!");
        } else {
            console.log(data);
            setFormError(null);
            navigate('/categories');
        }
    }

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="category_number">Category number:</label>
                <input
                    type="text"
                    id="category_number"
                    value={category_number}
                    onChange={(e) => setCategoryNumber(e.target.value)}
                />
                <label htmlFor="category_name">Category name:</label>
                <input
                    type="text"
                    id="category_name"
                    value={category_name}
                    onChange={(e) => setCatName(e.target.value)}
                />
                <button>Add Category</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateCategory
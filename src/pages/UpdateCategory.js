import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import supabase from "../config/supabaseClient";

const UpdateCategory = () => {
    const {category_number} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    const [category_name, setCatName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category_name) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const {data, error} = await supabase
            .from('category')
            .update({
                category_name
            })
            .eq('category_number', category_number);

        if (error) {
            console.log(error);
            setFormError('Please fill in all fields correctly!');
        } else {
            setFormError(null);
            navigate('/categories');
        }
    };

    useEffect(() => {
        const fetchCats = async () => {
            const {data, error} = await supabase
                .from('category')
                .select()
                .eq('category_number', category_number)
                .single();

            if (error) {
                navigate('/category', {replace: true});
            } else {
                setCatName(data.category_name);
            }
        };
        fetchCats();
    }, [category_number, navigate]);

    return (
        <div className="page update">
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category_name">Category name:</label>
                <input
                    type="text"
                    id="category_name"
                    value={category_name}
                    onChange={(e) => setCatName(e.target.value)}
                />

                <button>Update category</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateCategory;

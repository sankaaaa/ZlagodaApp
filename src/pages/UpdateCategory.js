import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";

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

        const response = await fetch(`http://localhost:8081/category/${category_number}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_name
            })
        });
        if (response.ok) {
            navigate('/categories');
        } else {
            setFormError('Error updating category');
        }
    };

    useEffect(() => {
        const fetchCats = async () => {
            const response = await fetch(`http://localhost:8081/category/${category_number}`);
            if (response.ok) {
                const [data] = await response.json();
                setCatName(data.category_name);
            } else {
                navigate('/category');
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

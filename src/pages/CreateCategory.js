import {useState} from "react";
import {useNavigate} from "react-router-dom";
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

        try {
            const categoryExistsResponse = await fetch(`http://localhost:8081/category/${category_number}`);
            if (!categoryExistsResponse.ok) {
                throw new Error("Error checking if category exists");
            }
            const categoryExistsData = await categoryExistsResponse.json();
            if (categoryExistsData.length > 0) {
                setFormError("Category with the same ID already exists in the table!");
                return;
            }

            const categoryNameExistsResponse = await fetch(`http://localhost:8081/category/name/${category_name}`);
            if (!categoryNameExistsResponse.ok) {
                throw new Error("Error checking if category name exists");
            }
            const categoryNameExistsData = await categoryNameExistsResponse.json();
            if (categoryNameExistsData.length > 0) {
                setFormError("Category with the same name already exists in the table!");
                return;
            }

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({category_number, category_name})
            };

            const addCategoryResponse = await fetch('http://localhost:8081/category', requestOptions);
            if (!addCategoryResponse.ok) {
                throw new Error("Error adding category");
            }

            navigate('/categories');
        } catch (error) {
            console.error(error);
            setFormError("An error occurred while adding category");
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
    );
}

export default CreateCategory;

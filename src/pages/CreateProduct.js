import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/create-form.css";

const CreateProduct = () => {
    const navigate = useNavigate();
    const [id_product, setIdProduct] = useState('');
    const [category_number, setCategoryNumber] = useState('');
    const [product_name, setProdName] = useState('');
    const [characteristics, setCharacter] = useState('');
    const [categories, setCategories] = useState([]);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8081/category/a');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
                setFormError('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id_product || !product_name || !category_number || !characteristics) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const existingProductResponse = await fetch(`http://localhost:8081/product/${id_product}`);
        if (!existingProductResponse.ok) {
            console.error("Error checking for existing product");
            setFormError("An error occurred while checking for existing product.");
            return;
        }

        const existingProduct = await existingProductResponse.json();
        if (existingProduct.length > 0) {
            setFormError("Product with the same ID already exists in the table!");
            return;
        }

        try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id_product, category_number, product_name, characteristics})
            };

            const addResponse = await fetch('http://localhost:8081/product', requestOptions);
            if (!addResponse.ok) {
                throw new Error('Error adding product');
            }

            navigate('/products');
        } catch (error) {
            console.error(error);
            setFormError("Error adding product");
        }
    };

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="id_product">ID:</label>
                <input
                    type="text"
                    id="id_product"
                    value={id_product}
                    onChange={(e) => setIdProduct(e.target.value)}
                />
                <label htmlFor="category_number">Category number:</label>
                <select
                    id="category_number"
                    value={category_number}
                    onChange={(e) => setCategoryNumber(e.target.value)}
                >
                    <option value="">Select category number</option>
                    {categories.map((category) => (
                        <option key={category.category_number} value={category.category_number}>
                            {`${category.category_number}, ${category.category_name}`}
                        </option>
                    ))}
                </select>

                <label htmlFor="product_name">Product name:</label>
                <input
                    type="text"
                    id="product_name"
                    value={product_name}
                    onChange={(e) => setProdName(e.target.value)}
                />
                <label htmlFor="characteristics">Characteristics:</label>
                <input
                    type="text"
                    id="characteristics"
                    value={characteristics}
                    onChange={(e) => setCharacter(e.target.value)}
                />
                <button>Add Product</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
};

export default CreateProduct;

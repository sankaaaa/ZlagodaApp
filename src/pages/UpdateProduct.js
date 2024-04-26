import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";

const UpdateProduct = () => {
    const {id_product} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [category_number, setCategoryNumber] = useState('');
    const [product_name, setProdName] = useState('');
    const [characteristics, setCharact] = useState('');

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

        if (!/^\d+$/.test(category_number)) {
            setFormError("Category number should contain only digits!");
            return;
        }

        const response = await fetch(`http://localhost:8081/product/${id_product}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_number,
                product_name,
                characteristics
            })
        });
        if (response.ok) {
            navigate('/products');
        } else {
            setFormError('Error updating product');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`http://localhost:8081/product/${id_product}`);
            if (response.ok) {
                const [data] = await response.json();
                setProdName(data.product_name);
                setCategoryNumber(data.category_number);
                setCharact(data.characteristics);
            } else {
                navigate('/product');
            }
        };
        fetchProduct();
    }, [id_product, navigate]);

    return (
        <div className="page update">
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="product_name">Product name:</label>
                <input
                    type="text"
                    id="product_name"
                    value={product_name}
                    onChange={(e) => setProdName(e.target.value)}
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
                <label htmlFor="characteristics">Characteristics:</label>
                <input
                    type="text"
                    id="characteristics"
                    value={characteristics}
                    onChange={(e) => setCharact(e.target.value)}
                />
                <button>Update product</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateProduct;

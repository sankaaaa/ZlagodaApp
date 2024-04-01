import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/create-form.css';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [id_product, setIdProduct] = useState('');
    const [category_number, setCategoryNumber] = useState('');
    const [product_name, setProdName] = useState('');
    const [characteristics, setCharacter] = useState('');

    const [formError, setFormError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d+$/.test(category_number)) {
            setFormError("Category number should contain only digits!");
            return;
        }

        if (!id_product || !product_name || !category_number || !characteristics) {
            setFormError("Please set all form fields correctly!");
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
                <input
                    type="text"
                    id="category_number"
                    value={category_number}
                    onChange={(e) => setCategoryNumber(e.target.value)}
                />
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
    )
}

export default CreateProduct
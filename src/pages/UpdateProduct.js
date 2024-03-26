import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import supabase from "../config/supabaseClient";

const UpdateProduct = () => {
    const {id_product} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    const [category_number, setCategoryNumber] = useState('');
    const [product_name, setProdName] = useState('');
    const [characteristics, setCharact] = useState('');

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

        const {data, error} = await supabase
            .from('product')
            .update({
                product_name,
                category_number,
                characteristics
            })
            .eq('id_product', id_product);

        if (error) {
            console.log(error);
            setFormError('Please fill in all fields correctly!');
        } else {
            setFormError(null);
            navigate('/products');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const {data, error} = await supabase
                .from('product')
                .select()
                .eq('id_product', id_product)
                .single();

            if (error) {
                navigate('/product', {replace: true});
            } else {
                setProdName(data.product_name);
                setCategoryNumber(data.category_number);
                setCharact(data.characteristics);
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
                <input
                    type="number"
                    id="category_number"
                    value={category_number}
                    onChange={(e) => setCategoryNumber(e.target.value)}
                />
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

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/login-form.css';

const Login = ({handleUserRole}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "zlagoda" && password === "12345") {
            handleUserRole("Manager");
            navigate("/employees");
        } else if (username === "cashier" && password === "98765") {
            handleUserRole("Cashier");
            navigate("/products");
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <div>
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button-login" type="submit">Login</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;

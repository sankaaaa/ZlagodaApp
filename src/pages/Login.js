import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/login-form.css';

//додати розрізнення для адміна/касира
const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (username, password) => {
        console.log("User logged in:", username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "zlagoda" && password === "12345") {
            handleLogin(username, password);
            navigate("/employees");
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

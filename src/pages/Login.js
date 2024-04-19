import { useState } from "react";
import { useNavigate } from "react-router-dom";
import passwords from "./passwords.json";
import supabase from "../config/supabaseClient";
import '../styles/login-form.css';

const Login = ({ handleUserRole }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Знаходимо користувача у файлі passwords.json
        const user = passwords.find(user => user.username === username && user.password === password);

        if (user) {
            try {
                // Отримуємо дані про користувача з бази даних
                const { data: employee, error } = await supabase
                    .from('employee')
                    .select('empl_role')
                    .eq('id_employee', username)
                    .single();

                if (error) throw error;

                if (employee) {
                    const { empl_role } = employee;
                    const userRole = empl_role;

                    handleUserRole(userRole);
                    localStorage.setItem("userRole", userRole);
                    navigate("/products");
                } else {
                    setError("Invalid username or password.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                setError("Error fetching user data. Please try again later.");
            }
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

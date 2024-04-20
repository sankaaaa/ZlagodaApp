import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "../styles/login-form.css";

const Login = ({ handleUserRole }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: employee, error } = await supabase
                .from("employee")
                .select("empl_role")
                .eq("id_employee", username)
                .single();

            if (error) throw error;

            if (employee && employee.empl_role) {
                const userRole = employee.empl_role;

                handleUserRole(userRole);
                localStorage.setItem("userRole", userRole);
                localStorage.setItem("userLogin", username);
                navigate("/products");
            } else {
                setError("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            setError("Error fetching user data. Please try again later.");
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
                    <button className="button-login" type="submit">
                        Login
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;

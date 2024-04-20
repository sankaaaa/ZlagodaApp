import {useState, useEffect} from "react";
import "../styles/create-form.css";

const MyPage = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage] = useState("");

    const username = localStorage.getItem("userLogin");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/employee/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setEmployeeData(data[0]);
            } catch (error) {
                console.error("Error fetching employee data:", error.message);
                setError("Error fetching employee data. Please try again later.");
            }
        };
        fetchData();
    }, [username]);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Логіка зміни паролю
    };

    return (
        <div className="my-page-container">
            <h2>Welcome, {employeeData?.empl_name}!</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <div className="employee-details">
                <p>
                    <strong>ID:</strong> {employeeData?.id_employee}
                </p>
                <p>
                    <strong>Full Name:</strong> {employeeData?.empl_name} {employeeData?.empl_surname}
                </p>
                <p>
                    <strong>Role:</strong> {employeeData?.empl_role}
                </p>
                <p>
                    <strong>Salary:</strong> {employeeData?.salary}
                </p>
                <p>
                    <strong>Date of birth:</strong> {employeeData?.date_of_birth}
                </p>
                <p>
                    <strong>Date of start:</strong> {employeeData?.date_of_start}
                </p>
                <p>
                    <strong>Phone number:</strong> {employeeData?.phone_number}
                </p>
                <p>
                    <strong>Address:</strong> {employeeData?.city}, {employeeData?.street}, {employeeData?.zip_code}
                </p>
            </div>
            <div className="change-password">
                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>Change Password</button>
            </div>
        </div>
    );
};

export default MyPage;

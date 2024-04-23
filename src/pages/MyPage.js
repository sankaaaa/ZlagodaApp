import {useState, useEffect} from "react";
import "../styles/create-form.css";
import employeeImage from "../styles/img.jpg";

const MyPage = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const currentPasswords = JSON.parse(localStorage.getItem("passwordData")) || {};

            currentPasswords[employeeData.id_employee] = newPassword;

            localStorage.setItem("passwordData", JSON.stringify(currentPasswords));

            setSuccessMessage("Password updated successfully.");
        } catch (error) {
            console.error("Error updating password:", error.message);
            setError("Error updating password. Please try again later.");
        }
    };

    const formatSalary = (salary) => {
        return parseFloat(salary).toFixed(2);
    };

    return (
        <div className="my-page-container">
            <div className="employee-details">
                <div className="employee-info">
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
                        <strong>Salary:</strong> {formatSalary(employeeData?.salary)}
                    </p>
                    <p>
                        <strong>Date of birth:</strong> {formatDate(employeeData?.date_of_birth)}
                    </p>
                    <p>
                        <strong>Date of start:</strong> {formatDate(employeeData?.date_of_start)}
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
                    {successMessage && <p className="success">{successMessage}</p>}
                </div>
            </div>
            <img src={employeeImage} alt="Employee" className="employee-image"/>
        </div>
    );
};

export default MyPage;

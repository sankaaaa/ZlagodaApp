import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../styles/create-form.css';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [id_employee, setIdEmployee] = useState('');
    const [empl_surname, setEmplSurname] = useState('');
    const [empl_name, setEmplName] = useState('');
    const [empl_role, setEmplRole] = useState('cashier');
    const [date_of_birth, setDateOfBirth] = useState('');
    const [date_of_start, setDateOfStart] = useState('');
    const [salary, setSalary] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip_code, setZipCode] = useState('');
    const [password, setPassword] = useState('');

    const [formError, setFormError] = useState(null);

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employeeAge = calculateAge(date_of_birth);
        if (employeeAge < 18 || employeeAge > 100) {
            setFormError("Employee must be at least 18 and maximum 100 years old!");
            return;
        }

        const isPhoneNumberValid = phone_number.length === 13 && /^\+?[0-9]{12}$/.test(phone_number);

        if (!isPhoneNumberValid) {
            setFormError("Phone number must be exactly 13 characters!");
            return;
        }

        const isSalaryValid = salary > 0;

        if (!isSalaryValid) {
            setFormError("Invalid salary!");
            return;
        }

        // Перевірка, чи date_of_start не раніше, ніж 18 років після date_of_birth
        const dateOfBirth = new Date(date_of_birth);
        const minDateOfStart = new Date(dateOfBirth.getFullYear() + 18, dateOfBirth.getMonth(), dateOfBirth.getDate());
        const selectedDateOfStart = new Date(date_of_start);
        if (selectedDateOfStart < minDateOfStart) {
            setFormError("Date of start must be at least 18 years after the date of birth!");
            return;
        }

        if (!id_employee || !empl_surname || !empl_name || !empl_role || !date_of_birth ||
            !date_of_start || !salary || !city || !street || !zip_code || !password) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const existingEmployeesResponse = await fetch(`http://localhost:8081/employee/${id_employee}`);
        if (!existingEmployeesResponse.ok) {
            console.error("Error checking for existing employee");
            setFormError("An error occurred while checking for existing employee.");
            return;
        }

        const existingEmployee = await existingEmployeesResponse.json();
        if (existingEmployee.length > 0) {
            setFormError("Employee with the same ID already exists in the table!");
            return;
        }

        try {
            const addResponse = await fetch('http://localhost:8081/employee', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id_employee,
                    empl_surname,
                    empl_name,
                    empl_role,
                    date_of_birth,
                    date_of_start,
                    salary,
                    phone_number,
                    city,
                    street,
                    zip_code
                })
            });

            if (!addResponse.ok) {
                throw new Error('Error adding employee');
            }

            const currentPasswords = JSON.parse(localStorage.getItem("passwordData")) || {};
            currentPasswords[id_employee] = password;
            localStorage.setItem("passwordData", JSON.stringify(currentPasswords));

            navigate('/employees');
        } catch (error) {
            console.error(error);
            setFormError("Error adding employee");
        }
    }

    return (
        <div className="page create">
            <form onSubmit={handleSubmit}>
                <label htmlFor="id_employee">ID:</label>
                <input
                    type="text"
                    id="id_employee"
                    value={id_employee}
                    onChange={(e) => setIdEmployee(e.target.value)}
                />
                <label htmlFor="empl_surname">Surname:</label>
                <input
                    type="text"
                    id="empl_surname"
                    value={empl_surname}
                    onChange={(e) => setEmplSurname(e.target.value)}
                />
                <label htmlFor="empl_name">Name:</label>
                <input
                    type="text"
                    id="empl_name"
                    value={empl_name}
                    onChange={(e) => setEmplName(e.target.value)}
                />
                <label htmlFor="empl_role">Role:</label>
                <select
                    id="empl_role"
                    value={empl_role}
                    onChange={(e) => setEmplRole(e.target.value)}
                >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                </select>
                <label htmlFor="date_of_birth">Date of birth:</label>
                <input
                    type="date"
                    id="date_of_birth"
                    value={date_of_birth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <label htmlFor="date_of_start">Date of start:</label>
                <input
                    type="date"
                    id="date_of_start"
                    value={date_of_start}
                    onChange={(e) => setDateOfStart(e.target.value)}
                />
                <label htmlFor="salary">Salary:</label>
                <input
                    type="number"
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                <label htmlFor="phone_number">Phone number:</label>
                <input
                    type="tel"
                    id="phone_number"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <label htmlFor="street">Street:</label>
                <input
                    type="text"
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
                <label htmlFor="zip_code">Zip-code:</label>
                <input
                    type="text"
                    id="zip_code"
                    value={zip_code}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>Add Employee</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateEmployee;
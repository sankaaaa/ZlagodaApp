import {useNavigate, useParams} from "react-router-dom";
import {useState, useEffect} from "react";

const UpdateEmployee = () => {
    const {id_employee} = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState(null);

    const [empl_surname, setEmplSurname] = useState('');
    const [empl_name, setEmplName] = useState('');
    const [empl_role, setEmplRole] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');
    const [date_of_start, setDateOfStart] = useState('');
    const [salary, setSalary] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zip_code, setZipCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id_employee || !empl_surname || !empl_name || !empl_role || !date_of_birth
            || !date_of_start || !salary || !phone_number || !city || !street || !zip_code) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const employeeAge = calculateAge(date_of_birth);
        if (employeeAge < 18 || employeeAge > 100) {
            setFormError("Employee must be at least 18 and maximum 100 years old!");
            return;
        }

        const startDate = new Date(date_of_start);
        const ageAtStartDate = calculateAge(date_of_birth);
        const today = new Date();
        if (startDate < new Date(today.setFullYear(today.getFullYear() - ageAtStartDate + 18))) {
            setFormError("Start date cannot be before the employee turns 18 years old!");
            return;
        }

        if (salary < 0) {
            setFormError("Salary cannot be negative!");
            return;
        }
        const isPhoneNumberValid = phone_number.length === 13 && /^\+?[0-9]{12}$/.test(phone_number);

        if (!isPhoneNumberValid) {
            setFormError("Please enter a valid phone number!");
            return;
        }

        const response = await fetch(`http://localhost:8081/employee/${id_employee}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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

        if (response.ok) {
            navigate('/employees');
        } else {
            setFormError('Error updating employee');
        }
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(`http://localhost:8081/employee/${id_employee}`);
            if (response.ok) {
                const [data] = await response.json();
                setEmplSurname(data.empl_surname);
                setEmplName(data.empl_name);
                setEmplRole(data.empl_role);
                setSalary(data.salary);
                setDateOfBirth(data.date_of_birth);
                setDateOfStart(data.date_of_start);
                setPhoneNumber(data.phone_number);
                setCity(data.city);
                setStreet(data.street);
                setZipCode(data.zip_code);
            } else {
                navigate('/employees');
            }
        };
        fetchEmployee();
    }, [id_employee, navigate]);

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

    return (
        <div className="page update">
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
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
                <button>Update employee</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
}

export default UpdateEmployee;

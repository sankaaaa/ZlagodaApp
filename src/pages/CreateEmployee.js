import {useState} from "react";
import {useNavigate} from "react-router-dom";
import supabase from "../config/supabaseClient";
import '../styles/create-form.css';
const CreateEmployee = () => {
    const navigate = useNavigate();
    const[id_employee, setIdEmployee] = useState('');
    const[empl_surname, setEmplSurname] = useState('');
    const[empl_name, setEmplName] = useState('');
    const[empl_role, setEmplRole] = useState('');
    const[date_of_birth, setDateOfBirth] = useState('');
    const[date_of_start, setDateOfStart] = useState('');
    const[salary, setSalary] = useState('');
    const[phone_number, setPhoneNumber] = useState('');
    const[city, setCity] = useState('');
    const[street, setStreet] = useState('');
    const[zip_code, setZipCode] = useState('');

    const[formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id_employee || !empl_surname || !empl_name || !empl_role || !date_of_birth
            || !date_of_start || !salary || !phone_number || !city || !street || !zip_code) {
            setFormError("Please set all form fields correctly!");
            return;
        }

        const { data: existingEmployees, error: existingEmployeeError } = await supabase
            .from('employee')
            .select('id_employee')
            .eq('id_employee', id_employee);

        if (existingEmployeeError) {
            console.error(existingEmployeeError.message);
            setFormError("An error occurred while checking for existing employee.");
            return;
        }

        if (existingEmployees.length > 0) {
            setFormError("Employee with the same ID already exists in the table!");
            return;
        }

        const { data, error } = await supabase
            .from('employee')
            .insert([{ id_employee, empl_surname, empl_name, empl_role, date_of_birth,
                date_of_start, salary, phone_number, city, street, zip_code }]);

        if (error) {
            console.log(error);
            setFormError("Please set all form fields correctly!");
        } else {
            console.log(data);
            setFormError(null);
            navigate('/Employees');
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
                <input
                    type="text"
                    id="empl_role"
                    value={empl_role}
                    onChange={(e) => setEmplRole(e.target.value)}
                />
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
                <button>Add Employee</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    )
}

export default CreateEmployee
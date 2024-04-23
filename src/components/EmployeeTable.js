import {useState, useEffect} from "react";
import Popup from "./EmployeePopup";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";

const EmployeeTable = ({employees, setEmployees}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showOnlyCashiers, setShowOnlyCashiers] = useState(false);
    const [searchSurname, setSearchSurname] = useState("");
    const [formError, setFormError] = useState(null);
    const [userLogin, setUserLogin] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem("userLogin");
        setUserLogin(username);
    }, []);

    const sortedEmployees = employees
        .filter(employee => !showOnlyCashiers || employee.empl_role === 'cashier')
        .filter(employee => searchSurname === "" || employee.empl_surname.toLowerCase().includes(searchSurname.toLowerCase()))
        .sort((a, b) => {
            if (sortConfig.key !== null) {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
            }
            return 0;
        });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleClosePopup = () => {
        setSelectedEmployee(null);
    };

    const handleDelete = async (emplId) => {
        const confirmed = window.confirm("Are you sure you want to delete this employee?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/employee/${emplId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Could not delete employee due to integration reasons');
            }
            const updatedEmpl = employees.filter(employee => employee.id_employee !== emplId);
            setEmployees(updatedEmpl);
        } catch (error) {
            console.error(error);
            if (error.message.includes("500")) {
                setFormError("Employee cannot be deleted due to integration reasons");
            } else {
                setFormError(error.message);
            }
        }
    };

    const handleShowOnlyCashiersChange = (e) => {
        setShowOnlyCashiers(e.target.checked);
    };

    const handleSearchChange = (e) => {
        setSearchSurname(e.target.value);
    };

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-employee" className="link-create-new">Create New Employee</Link>
                </div>
                <div className="search-input">
                    <label htmlFor="searchSurname">Search surname:</label>
                    <input
                        type="text"
                        placeholder=""
                        value={searchSurname}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="employee-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={showOnlyCashiers}
                            onChange={handleShowOnlyCashiersChange}
                        />
                        Show only cashiers
                    </label>
                </div>
            </div>
            {formError && <p className="error">{formError}</p>}
            <table className="employee-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('id_employee')}>ID</th>
                    <th onClick={() => requestSort('empl_surname')}>Surname</th>
                    <th onClick={() => requestSort('empl_name')}>Name</th>
                    <th onClick={() => requestSort('empl_role')}>Role</th>
                    <th onClick={() => requestSort('salary')}>Salary</th>
                    <th onClick={() => requestSort('phone_number')}>Phone Number</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedEmployees.map(employee => (
                    <tr key={employee.id_employee}>
                        <td style={{cursor: 'pointer', fontWeight: 'bold'}}
                            onClick={() => handleRowClick(employee)}>{employee.id_employee}.
                        </td>
                        <td>{employee.empl_surname}</td>
                        <td>{employee.empl_name}</td>
                        <td>{employee.empl_role}</td>
                        <td>{employee.salary}</td>
                        <td>{employee.phone_number}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={'/' + employee.id_employee}>
                                    Edit
                                </Link>
                            </button>
                            <button
                                className="edit-button"
                                onClick={() => handleDelete(employee.id_employee)}
                                disabled={employee.id_employee === userLogin}
                                style={employee.id_employee === userLogin ? {backgroundColor: "#BF863D"} : {}}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedEmployee && <Popup customer={selectedEmployee} onClose={handleClosePopup}/>}
        </div>
    );
}

export default EmployeeTable;

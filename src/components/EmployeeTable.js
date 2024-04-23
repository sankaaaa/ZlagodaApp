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
    const [resultData, setResultData] = useState([]);
    const [showResultTable, setShowResultTable] = useState(false); // Додаємо стан для відображення таблиці результатів запиту

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

    const handlePrint = () => {
        window.print();
    };

    const formatSalary = (salary) => {
        return new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(salary);
    };

    const handleCheckboxChange = async (e) => {
        setShowResultTable(e.target.checked);
        try {
            const response = await fetch(`http://localhost:8081/employee/workers`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setResultData(result);
        } catch (error) {
            console.error(error);
        }
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
                <div className="employee-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={showResultTable}
                            onChange={handleCheckboxChange}
                        />
                        Show result table
                    </label>
                </div>
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
            {formError && <p className="error">{formError}</p>}
            {showResultTable ? (
                <div>
                    <h2>Special Query Result Table</h2>
                    <p>This table shows number of employees from each city, who have salary 1000+ and have sum total
                        1+</p>
                    <table className="employee-table">
                        <thead>
                        <tr>
                            <th>City</th>
                            <th>Number of Employees</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resultData.map(row => (
                            <tr key={row.city}>
                                <td>{row.city}</td>
                                <td>{row.num_employees}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
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
                            <td>{formatSalary(employee.salary) + '$'}</td>
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
            )}
            {selectedEmployee && <Popup customer={selectedEmployee} onClose={handleClosePopup}/>}
        </div>
    );
}

export default EmployeeTable;

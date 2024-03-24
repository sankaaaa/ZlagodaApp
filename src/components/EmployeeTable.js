import {useState} from "react";
import Popup from "./EmployeePopup";
import '../styles/employee-table.css';

const EmployeeTable = ({ employees }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const sortedEmployees = employees.sort((a, b) => {
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
        setSortConfig({ key, direction });
    };

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleClosePopup = () => {
        setSelectedEmployee(null);
    };

    return (

        <div>
            <table className="employee-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('id_employee')}>ID</th>
                    <th onClick={() => requestSort('empl_surname')}>Surname</th>
                    <th onClick={() => requestSort('empl_name')}>Name</th>
                    <th onClick={() => requestSort('empl_role')}>Role</th>
                    <th onClick={() => requestSort('salary')}>Salary</th>
                    <th onClick={() => requestSort('phone_number')}>Phone Number</th>
                </tr>
                </thead>
                <tbody>
                {sortedEmployees.map(employee => (
                    <tr key={employee.id_employee} onClick={() => handleRowClick(employee)}>
                        <td>{employee.id_employee}</td>
                        <td>{employee.empl_surname}</td>
                        <td>{employee.empl_name}</td>
                        <td>{employee.empl_role}</td>
                        <td>{employee.salary}</td>
                        <td>{employee.phone_number}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedEmployee && <Popup employee={selectedEmployee} onClose={handleClosePopup} />}
        </div>
    );
}

export default EmployeeTable;
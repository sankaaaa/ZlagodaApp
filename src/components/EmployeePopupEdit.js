import { useState } from "react";

const EditEmployeePopup = ({ employee, onClose }) => {
    const [editedEmployee, setEditedEmployee] = useState(employee);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee({ ...editedEmployee, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Отриманий editedEmployee можна використовувати для подальшої обробки, наприклад, збереження змін в базі даних
        console.log("Edited employee:", editedEmployee);
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Employee</h2>
                <form onSubmit={handleSubmit}>
                    <label>ID:</label>
                    <input type="text" name="id_employee" value={editedEmployee.id_employee} onChange={handleChange} readOnly />
                    <label>Surname:</label>
                    <input type="text" name="empl_surname" value={editedEmployee.empl_surname} onChange={handleChange} />
                    <label>Name:</label>
                    <input type="text" name="empl_name" value={editedEmployee.empl_name} onChange={handleChange} />
                    <label>Role:</label>
                    <input type="text" name="empl_role" value={editedEmployee.empl_role} onChange={handleChange} />
                    <label>Salary:</label>
                    <input type="text" name="salary" value={editedEmployee.salary} onChange={handleChange} />
                    <label>Phone Number:</label>
                    <input type="text" name="phone_number" value={editedEmployee.phone_number} onChange={handleChange} />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default EditEmployeePopup;

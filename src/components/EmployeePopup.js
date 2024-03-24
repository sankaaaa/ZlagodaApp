 import '../styles/employee-popup.css';

 const Popup = ({ employee, onClose }) => {
     return (
         <div className="popup">
             <div className="popup-content">
                 <span className="close" onClick={onClose}>&times;</span>
                 <h2>Employee Details</h2>
                 <p><strong>ID:</strong> {employee.id_employee}</p>
                 <p><strong>Surname:</strong> {employee.empl_surname}</p>
                 <p><strong>Name:</strong> {employee.empl_name}</p>
                 <p><strong>Patronymic:</strong> {employee.empl_patronymic}</p>
                 <p><strong>Role:</strong> {employee.empl_role}</p>
                 <p><strong>Date of birth:</strong> {employee.date_of_birth}</p>
                 <p><strong>Date of start:</strong> {employee.date_of_start}</p>
                 <p><strong>Salary:</strong> {employee.salary}</p>
                 <p><strong>Phone Number:</strong> {employee.phone_number}</p>
                 <p><strong>City:</strong> {employee.city}</p>
                 <p><strong>Street:</strong> {employee.street}</p>
                 <p><strong>Zip-code:</strong> {employee.zip_code}</p>
             </div>
         </div>
     );
 }

 export default Popup;

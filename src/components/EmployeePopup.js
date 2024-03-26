 import '../styles/employee-popup.css';

 const Popup = ({ customer, onClose }) => {
     return (
         <div className="popup">
             <div className="popup-content">
                 <span className="close" onClick={onClose}>&times;</span>
                 <h2>Employee Details</h2>
                 <p><strong>ID:</strong> {customer.id_employee}</p>
                 <p><strong>Surname:</strong> {customer.empl_surname}</p>
                 <p><strong>Name:</strong> {customer.empl_name}</p>
                 <p><strong>Patronymic:</strong> {customer.empl_patronymic}</p>
                 <p><strong>Role:</strong> {customer.empl_role}</p>
                 <p><strong>Date of birth:</strong> {customer.date_of_birth}</p>
                 <p><strong>Date of start:</strong> {customer.date_of_start}</p>
                 <p><strong>Salary:</strong> {customer.salary}</p>
                 <p><strong>Phone Number:</strong> {customer.phone_number}</p>
                 <p><strong>City:</strong> {customer.city}</p>
                 <p><strong>Street:</strong> {customer.street}</p>
                 <p><strong>Zip-code:</strong> {customer.zip_code}</p>
             </div>
         </div>
     );
 }

 export default Popup;

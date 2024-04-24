import '../styles/employee-popup.css';

const Popup = ({customer, onClose}) => {
    const formatDate = (date) => {
        const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const formatSalary = (salary) => {
        return new Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(salary);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Employee Details</h2>
                <p><strong>ID:</strong> {customer.id_employee}</p>
                <p><strong>Surname:</strong> {customer.empl_surname}</p>
                <p><strong>Name:</strong> {customer.empl_name}</p>
                {customer.empl_patronymic && <p><strong>Patronymic:</strong> {customer.empl_patronymic}</p>}
                <p><strong>Role:</strong> {customer.empl_role}</p>
                <p><strong>Date of birth:</strong> {formatDate(customer.date_of_birth)}</p>
                <p><strong>Date of start:</strong> {formatDate(customer.date_of_start)}</p>
                <p><strong>Salary:</strong> {formatSalary(customer.salary) + '$'}</p>
                <p><strong>Phone Number:</strong> {customer.phone_number}</p>
                <p><strong>City:</strong> {customer.city}</p>
                <p><strong>Street:</strong> {customer.street}</p>
                <p><strong>Zip-code:</strong> {customer.zip_code}</p>
                <button className="printB" onClick={handlePrint}>Print</button>
            </div>
        </div>
    );
}

export default Popup;

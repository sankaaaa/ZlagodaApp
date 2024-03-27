import {useState} from "react";
// import Popup from "./EmployeePopup";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";
import PopupCust from "./CustomerPopup";

const EmployeeTable = ({customers}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [searchSurname, setSearchSurname] = useState("");

    const sortedEmployees = customers
        .filter(customer => searchSurname === "" || customer.cust_surname.toLowerCase().includes(searchSurname.toLowerCase()))
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

    const handleRowClick = (customer) => {
        setSelectedCustomers(customer);
    };

    const handleClosePopup = () => {
        setSelectedCustomers(null);
    };

    const handleDelete = async (customer) => {
        const {data, error} = await supabase
            .from('customer_card')
            .delete()
            .eq('card_number', customer.card_number)

        if (error) {
            console.log(error)
        } else {
            console.log(data)
            window.location.reload();
        }
    }

    const handleSearchChange = (e) => {
        setSearchSurname(e.target.value);
    };

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-customer" className="link-create-new">Create New Customer</Link>
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
            </div>
            <table className="employee-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('card_number')}>Card number</th>
                    <th onClick={() => requestSort('cust_surname')}>Surname</th>
                    <th onClick={() => requestSort('cust_name')}>Name</th>
                    <th onClick={() => requestSort('phone_number')}>Phone number</th>
                    <th onClick={() => requestSort('percent')}>Percent</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedEmployees.map(customer => (
                    <tr key={customer.card_number}>
                        <td style={{cursor: 'pointer', fontWeight: 'bold'}}
                            onClick={() => handleRowClick(customer)}>{customer.card_number}.
                        </td>
                        <td>{customer.cust_surname}</td>
                        <td>{customer.cust_name}</td>
                        <td>{customer.phone_number}</td>
                        <td>{customer.percent}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={'/customers/' + customer.card_number}>
                                    Edit
                                </Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(customer)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedCustomers && <PopupCust customer={selectedCustomers} onClose={handleClosePopup}/>}
        </div>
    );
}

export default EmployeeTable;
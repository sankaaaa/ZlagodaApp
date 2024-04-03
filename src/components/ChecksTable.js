import { useState } from "react";
import Popup from "./ChecksPopup";
import '../styles/employee-table.css';
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

const ChecksTable = ({ checks }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [selectedCheck, setSelectedCheck] = useState(null);

    const sortedChecks = checks
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
        setSortConfig({ key, direction });
    };

    const handleRowClick = (check) => {
        setSelectedCheck(check);
    };

    const handleClosePopup = () => {
        setSelectedCheck(null);
    };

    const handleDelete = async (check) => {
        const confirmed = window.confirm("Are you sure you want to delete this check?");
        if (!confirmed) return;
        const { data, error } = await supabase
            .from('check')
            .delete()
            .eq('check_number', check.check_number)

        if (error) {
            console.log(error)
        } else {
            console.log(data)
            window.location.reload();
        }
    }

    return (
        <div>
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-check" className="link-create-new">Create New Check</Link>
                </div>
            </div>
            <table className="employee-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('check_number')}>Check number</th>
                    <th onClick={() => requestSort('id_employee')}>ID employee</th>
                    <th onClick={() => requestSort('card_number')}>Card number</th>
                    <th onClick={() => requestSort('print_date')}>Print date</th>
                    <th onClick={() => requestSort('sum_total')}>Sum total</th>
                    <th onClick={() => requestSort('vat')}>vat</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {sortedChecks.map(check => (
                    <tr key={check.check_number}>
                        <td style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => handleRowClick(check)}>{check.check_number}.
                        </td>
                        <td>{check.id_employee}</td>
                        <td>{check.card_number}</td>
                        <td>{check.print_date}</td>
                        <td>{check.sum_total}</td>
                        <td>{check.vat}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={'/' + check.check_number}>
                                    Edit
                                </Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(check)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedCheck && <Popup check={selectedCheck} onClose={handleClosePopup} />} {/* Відображення попапу */}
        </div>
    );
}

export default ChecksTable;

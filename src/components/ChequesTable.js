import {useState, useEffect} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";

const ChequesTable = ({cheques}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [chequeList, setChequeList] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredCheques, setFilteredCheques] = useState(cheques);
    const [cashiers, setCashiers] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0);
    const [filterApplied, setFilterApplied] = useState(false);

    useEffect(() => {
        async function fetchCashiers() {
            try {
                const {data, error} = await supabase
                    .from('employee')
                    .select('id_employee')
                    .eq('empl_role', 'cashier');

                if (error)
                    throw error;

                setCashiers(data.map(cashier => cashier.id_employee));
            } catch (error) {
                console.error('Error fetching cashiers:', error.message);
            }
        }

        fetchCashiers();
    }, []);

    useEffect(() => {
        setFilteredCount(filteredCheques.length);
    }, [filteredCheques]);

    const sortedCategories = cheques.sort((a, b) => {
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

    const handleRowClick = (cheque) => {
        setSelectedCheque(cheque);
        fetchCheques(cheque.check_number);
        // setIsPopupOpen(true);
    };

    const handleCashierChange = (e) => {
        setSelectedCashier(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleApplyFilters = () => {
        let filteredResults = cheques;

        if (selectedCashier !== '') {
            filteredResults = filteredResults.filter(cheque => cheque.id_employee === selectedCashier);
        }

        if (startDate !== '' && endDate !== '') {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            filteredResults = filteredResults.filter(cheque => {
                const chequeDate = new Date(cheque.print_date);
                return chequeDate >= startDateObj && chequeDate <= endDateObj;
            });
        }

        setFilteredCheques(filteredResults);
        setFilterApplied(true);
    };

    const fetchCheques = async (chequeNumber) => {
        const {data, error} = await supabase
            .from('cheque')
            .select()
            .eq('check_number', chequeNumber);
        if (error) {
            console.log(error);
        } else {
            setChequeList(data);
        }
    };

    const handleDelete = async (cheque) => {
        const confirmed = window.confirm("Are you sure you want to delete this cheque?");
        if (!confirmed) return;

        const {data, error} = await supabase
            .from('cheque')
            .delete()
            .eq('check_number', cheque.check_number);

        if (error) {
            console.log(error);
        } else {
            console.log(data);
            window.location.reload();
        }
    };

    return (
        <div className="cat-table">
            <div className="top-line">
                <div className="create-new-container">
                    <Link to="/create-cheque" className="link-create-new">Create New Cheque</Link>
                </div>
                <div className="filter-container">
                    <select
                        value={selectedCashier}
                        onChange={handleCashierChange}
                    >
                        <option value="">All Cashiers</option>
                        {cashiers.map(cashier => (
                            <option key={cashier} value={cashier}>{cashier}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                    <label>-</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                    />
                    <button className="applyb" onClick={handleApplyFilters}>Apply</button>
                </div>
            </div>
            {filterApplied && <div>Filtered Results: {filteredCount}</div>}
            <table className="category-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('check_number')}>Cheque Number</th>
                    <th onClick={() => requestSort('id_employee')}>ID employee</th>
                    <th onClick={() => requestSort('card_number')}>Card number</th>
                    <th onClick={() => requestSort('print_date')}>Print date</th>
                    <th onClick={() => requestSort('sum_total')}>Sum total</th>
                    <th onClick={() => requestSort('vat')}>VAT</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {filteredCheques.map(cheque => (
                    <tr key={cheque.check_number}>
                        <td style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleRowClick(cheque)}>
                            {cheque.check_number}.
                        </td>
                        <td>{cheque.id_employee}</td>
                        <td>{cheque.card_number}</td>
                        <td>
                            {new Date(cheque.print_date).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            }).replace(/\//g, '.').replace(',', '')}
                        </td>
                        <td>{cheque.sum_total}</td>
                        <td>{cheque.vat}</td>
                        <td>
                            <button className="edit-button">
                                <Link to={`/cheques/${cheque.check_number}`}>Edit</Link>
                            </button>
                            <button className="edit-button" onClick={() => handleDelete(cheque)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChequesTable;

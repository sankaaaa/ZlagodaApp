import {useState, useEffect} from "react";
import '../styles/employee-table.css';
import {Link} from "react-router-dom";
import supabase from "../config/supabaseClient";
import Popup from "./CheckPopup";

const ChequesTable = ({cheques, setCheques, userRole}) => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [chequeList, setChequeList] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredCheques, setFilteredCheques] = useState(cheques);
    const [cashiers, setCashiers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0);
    const [filterApplied, setFilterApplied] = useState(false);
    const [totalSales, setTotalSales] = useState({});
    const [allCashiersSelected, setAllCashiersSelected] = useState(false);
    const [totalUnitsSold, setTotalUnitsSold] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [fetchEmployeesEnabled, setFetchEmployeesEnabled] = useState(false);
    const userId = localStorage.getItem("userLogin");
    const [formError, setFormError] = useState(null);

    const handleFetchEmployeesToggle = async () => {
        setFetchEmployeesEnabled(!fetchEmployeesEnabled);
    };

    useEffect(() => {
        async function fetchEmployees() {
            if (fetchEmployeesEnabled) {
                try {
                    const response = await fetch(`http://localhost:8081/cheque/user/${userId}`);
                    if (!response.ok)
                        throw new Error('Could not fetch employees');
                    const data = await response.json();
                    console.log(data)
                    setEmployees(data);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        fetchEmployees();
    }, [fetchEmployeesEnabled, userId]);

    useEffect(() => {
        async function fetchCashiers() {
            try {
                const {data, error} = await supabase
                    .from('employee')
                    .select('id_employee, empl_surname');

                if (error)
                    throw error;

                setCashiers(data);
            } catch (error) {
                console.error('Error fetching cashiers:', error.message);
            }
        }

        fetchCashiers();
    }, []);
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const {data, error} = await supabase
                    .from('customer_card')
                    .select('card_number, cust_surname');

                if (error)
                    throw error;

                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error.message);
            }
        }

        fetchCustomers();
    }, []);

    useEffect(() => {
        setFilteredCount(filteredCheques.length);
    }, [filteredCheques]);

    useEffect(() => {
        const calculateTotalSales = () => {
            const salesByCashier = {};

            filteredCheques.forEach(cheque => {
                const cashierId = cheque.id_employee;
                if (!salesByCashier[cashierId]) {
                    salesByCashier[cashierId] = 0;
                }
                salesByCashier[cashierId] += parseFloat(cheque.sum_total);
            });

            setTotalSales(salesByCashier);
        };

        calculateTotalSales();
    }, [filteredCheques]);

    useEffect(() => {
        const calculateTotalUnitsSold = async () => {
            let totalUnits = 0;
            for (const cheque of filteredCheques) {
                const {data, error} = await supabase
                    .from('sale')
                    .select('product_number')
                    .eq('check_number', cheque.check_number);
                if (error) {
                    console.error('Error fetching sales:', error.message);
                    continue;
                }
                totalUnits += data.reduce((acc, curr) => acc + curr.product_number, 0);
            }
            setTotalUnitsSold(totalUnits);
        };

        calculateTotalUnitsSold();
    }, [filteredCheques, startDate, endDate, fetchEmployeesEnabled]);

    useEffect(() => {
        const applyFilters = async () => {
            let filteredResults = [...cheques];

            if (fetchEmployeesEnabled) {
                filteredResults = filteredResults.filter(cheque => {
                    return employees.find(employee => employee.id_employee === cheque.id_employee);
                });

                filteredResults = filteredResults.filter(cheque => parseFloat(cheque.sum_total) < 15);
            } else {
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
            }

            setFilteredCheques(filteredResults);
            setFilterApplied(true);
            setAllCashiersSelected(selectedCashier === '');

            let totalUnits = 0;
            for (const cheque of filteredResults) {
                const {data, error} = await supabase
                    .from('sale')
                    .select('product_number')
                    .eq('check_number', cheque.check_number);
                if (error) {
                    console.error('Error fetching sales:', error.message);
                    continue;
                }
                totalUnits += data.reduce((acc, curr) => acc + curr.product_number, 0);
            }
            setTotalUnitsSold(totalUnits);
        };


        applyFilters();
    }, [fetchEmployeesEnabled, selectedCashier, startDate, endDate, employees]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});

        const sortedCheques = [...filteredCheques].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setFilteredCheques(sortedCheques);
    };

    const handleRowClick = async (cheque) => {
        setSelectedCheque(cheque);
        setShowPopup(true);
        await fetchCheques(cheque.check_number);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
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

    const handleApplyFilters = async () => {
        let filteredResults = [...cheques];
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
        setAllCashiersSelected(selectedCashier === '');

        let totalUnits = 0;
        for (const cheque of filteredResults) {
            const {data, error} = await supabase
                .from('sale')
                .select('product_number')
                .eq('check_number', cheque.check_number);
            if (error) {
                console.error('Error fetching sales:', error.message);
                continue;
            }
            totalUnits += data.reduce((acc, curr) => acc + curr.product_number, 0);
        }
        setTotalUnitsSold(totalUnits);
    };

    const fetchCheques = async (chequeNumber) => {
        try {
            const response = await fetch(`http://localhost:8081/cheque/${chequeNumber}`);
            if (!response.ok)
                throw new Error('Could not fetch cheques');
            const data = await response.json();
            setChequeList(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (chequeNum) => {
        const confirmed = window.confirm("Are you sure you want to delete this cheque?");
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:8081/cheque/${chequeNum}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Could not delete cheque due to integration reasons');
            }
            const updatedProducts = cheques.filter(cheque => cheque.check_number !== chequeNum);
            setCheques(updatedProducts);
            window.location.reload();
        } catch (error) {
            console.error(error);
            if (error.message.includes("500")) {
                setFormError("cheque cannot be deleted due to integration reasons");
            } else {
                setFormError(error.message);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="cat-table">
            <div className="top-line">
                <div className="fetch-employees-toggle">
                    <label>
                        <p>Total less than 15 (not me)</p>
                        <input
                            type="checkbox"
                            checked={fetchEmployeesEnabled}
                            onChange={handleFetchEmployeesToggle}
                        />
                    </label>
                    <button className="printB" onClick={handlePrint}>Print</button>
                </div>
                <div className="create-new-container" style={{display: userRole === "manager" ? "none" : "block"}}>
                    {userRole === "cashier" && (
                        <Link to="/create-cheque" className="link-create-new">Create New Cheque</Link>
                    )}
                </div>
                <div className="filter-container">
                    <select
                        value={selectedCashier}
                        onChange={handleCashierChange}
                    >
                        <option value="">All Cashiers</option>
                        {cashiers.map(cashier => (
                            <option key={cashier.id_employee}
                                    value={cashier.id_employee}>{cashier.id_employee}, {cashier.empl_surname}</option>
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
            {filterApplied && (
                <div>
                    {allCashiersSelected ? (
                        <div>Total sum of saled products for all
                            cashiers: {Object.values(totalSales).reduce((acc, curr) => acc + curr, 0).toFixed(2)}</div>
                    ) : (
                        Object.keys(totalSales).map(cashierId => (
                            <div key={cashierId}>Total sum of saled products for
                                cashier {cashierId}: {totalSales[cashierId].toFixed(2)}</div>
                        ))
                    )}
                    <div>Total units sold: {totalUnitsSold}</div>
                </div>
            )}
            {formError && <p className="error">{formError}</p>}
            <table className="category-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort('check_number')}>Cheque Number</th>
                    <th onClick={() => requestSort('id_employee')}>ID employee</th>
                    <th onClick={() => requestSort('card_number')}>Card number</th>
                    <th onClick={() => requestSort('print_date')}>Print date</th>
                    <th onClick={() => requestSort('sum_total')}>Sum total</th>
                    <th onClick={() => requestSort('vat')}>VAT</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {filteredCheques.map(cheque => (
                    <tr key={cheque.check_number}>
                        <td style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleRowClick(cheque)}>
                            {cheque.check_number}.
                        </td>
                        <td>{cheque.id_employee}, {cashiers.find(cashier => cashier.id_employee === cheque.id_employee)?.empl_surname}</td>
                        <td>{cheque.card_number}, {customers.find(customer => customer.card_number === cheque.card_number)?.cust_surname}</td>
                        <td>
                            {new Date(cheque.print_date).toLocaleString('en-GB', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            }).replace(/\//g, '.').replace(',', '')}
                        </td>
                        <td>{parseFloat(cheque.sum_total).toFixed(2)}</td>
                        <td>{parseFloat(cheque.vat).toFixed(2)}</td>
                        <td>
                            {userRole === "manager" ? (
                                <button className="edit-button"
                                        onClick={() => handleDelete(cheque.check_number)}>Delete</button>
                            ) : (
                                <button className="edit-button" disabled
                                        style={{backgroundColor: "#BF863D"}}>Delete</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showPopup && (
                <Popup cheque={selectedCheque} chequeList={chequeList} onClose={handleClosePopup}/>
            )}
        </div>
    );
};

export default ChequesTable;

import {useState} from "react";
import '../styles/employee-table.css';

const SalesTable = ({sales, setSales}) => {
    const [setSelectedSale] = useState(null);

    const handleRowClick = (sale) => {
        setSelectedSale(sale);
    };

    const handleDelete = async (upc, checkNumber) => {
        const confirmed = window.confirm("Are you sure you want to delete this sale?");
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8081/sale/${upc}/${checkNumber}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Could not delete sale');
            }
            const updatedSales = sales.filter(sale => !(sale.upc === upc && sale.check_number === checkNumber));
            setSales(updatedSales);
        } catch (error) {
            console.error('Error deleting sale:', error.message);
        }
    };

    return (
        <div>
            <table className="product-table">
                <thead>
                <tr>
                    <th>UPC</th>
                    <th>Cheque number</th>
                    <th>Products number</th>
                    <th>Selling price</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {sales && sales.map(sale => (
                    <tr key={`${sale.upc}-${sale.check_number}`}>
                        <td style={{fontWeight: 'bold'}} onClick={() => handleRowClick(sale)}>{sale.upc}.</td>
                        <td>{sale.check_number}</td>
                        <td>{sale.product_number}</td>
                        <td>{sale.selling_price}</td>
                        <td>
                            <button className="edit-button"
                                    onClick={() => handleDelete(sale.upc, sale.check_number)}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;

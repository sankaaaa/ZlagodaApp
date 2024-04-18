import '../styles/employee-table.css';

const SalesTable = ({sales, setSales, userRole}) => {
    const handleDelete = async (upc, checkNumber) => {
        const confirmed = window.confirm("Are you sure you want to delete this sale?");
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8081/sale/${upc}/${checkNumber}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
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
                        <td style={{fontWeight: 'bold'}}>{sale.upc}.</td>
                        <td>{sale.check_number}</td>
                        <td>{sale.product_number}</td>
                        <td>{sale.selling_price}</td>
                        <td>
                            {userRole === "Manager" ? (
                                <button className="edit-button"
                                        onClick={() => handleDelete(sale.upc, sale.check_number)}>Delete</button>
                            ) : (
                                <button className="edit-button" disabled
                                        style={{backgroundColor: "#BF863D"}}>Delete</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;

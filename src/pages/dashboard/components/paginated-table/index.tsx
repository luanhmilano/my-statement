import styles from '../../styles/paginated-table.module.css';
import type { PaginatedTableProps } from '../../types';

export default function PaginatedTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
}: PaginatedTableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Description</th>
            <th>Type</th>
            <th>Card</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.description}</td>
              <td>{item.type}</td>
              <td>{item.card}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td
                className={item.amount < 0 ? styles.negative : styles.positive}
              >
                ${Math.abs(item.amount).toFixed(2)}
              </td>
              <td>
                <button className={styles.downloadButton}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <div className={styles.pagination}>
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

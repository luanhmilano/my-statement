import { useState, useMemo } from 'react';
import styles from '../../styles/paginated-table.module.css';
import type { PaginatedTableProps } from '../../types';

const ArrowUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#DCFAF8"/>
    <path d="M12 7V17M12 7L7 12M12 7L17 12" stroke="#16DBCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(0 12 12)"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFE0EB"/>
    <path d="M12 17V7M12 17L7 12M12 17L17 12" stroke="#FF82AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function PaginatedTable({
  data,
}: Omit<PaginatedTableProps, 'currentPage' | 'totalPages' | 'onPageChange'>) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    const total = data.length;
    const pages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = data.slice(startIndex, endIndex);

    return {
      paginatedData: paginated,
      totalPages: pages,
      totalItems: total
    };
  }, [data, currentPage]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.empty}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Card</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => {
              const isNegative = item.type === 'Withdrawal' || item.amount < 0;
              
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.descriptionCell}>
                      {isNegative ? <ArrowDownIcon /> : <ArrowUpIcon />}
                      {item.description}
                    </div>
                  </td>
                  <td>#{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.card}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}</td>
                  <td className={isNegative ? styles.negative : styles.positive}>
                    {isNegative ? '-' : '+'}${Math.abs(Number(item.amount)).toLocaleString()}
                  </td>
                  <td>
                    <button className={styles.downloadButton}>Download</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              <span>
                Showing {startItem}-{endItem} of {totalItems} results
              </span>
            </div>
            
            <div className={styles.paginationControls}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {renderPageNumbers()}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
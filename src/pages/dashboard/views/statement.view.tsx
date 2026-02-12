import BalanceTop from '../components/balance-top';
import PaginatedTable from '../components/paginated-table';
import styles from '../styles/statement.module.css';
import type { StatementViewProps } from '../types';
import { LuWallet, LuReceipt } from 'react-icons/lu';

export default function StatementView({
  data,
  loading,
  error,
  onRetry,
  balanceTotal,
}: StatementViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.balanceTopHeader}>
        <BalanceTop
          amount={balanceTotal.balance}
          title="Money"
          icon={LuWallet}
          type="money"
        />
        <BalanceTop
          amount={balanceTotal.expenses}
          title="Expenses"
          icon={LuReceipt}
          type="expenses"
        />
        <BalanceTop
          amount={balanceTotal.earnings}
          title="Earnings"
          icon={LuReceipt}
          type="earnings"
        />
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.contentArea}>
          <PaginatedTable data={data} />
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
}

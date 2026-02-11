import styles from '../../styles/balance-top.module.css';
import type { BalanceTopProps } from '../../types';

export default function BalanceTop({
  icon: IconComponent,
  title,
  amount,
  type = 'default'
}: BalanceTopProps & { type?: 'money' | 'expenses' | 'earnings' | 'default' }) {
  return (
    <div className={styles.balanceTop} data-type={type}>
      <span className={styles.iconWrapper}>{IconComponent && <IconComponent />}</span>
      <div className={styles.contentWrapper}>
        <p className={styles.balanceTitle}>{title}</p>
        <p className={styles.balanceAmount}>${amount}</p>
      </div>
    </div>
  );
}

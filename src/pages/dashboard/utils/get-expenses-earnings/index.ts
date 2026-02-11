import type { StatementItem } from '../../types';

export const getExpensesEarnings = (data: StatementItem[]) => {
  let totalEarnings = 0;
  let totalExpenses = 0;

  data.forEach(item => {
    if (item.type === 'Deposit') {
      totalEarnings += item.amount;
    } else if (item.type === 'Withdrawal' || item.type === 'Transfer') {
      totalExpenses += item.amount;
    }
  });

  return { 
    totalEarnings: totalEarnings.toFixed(2), 
    totalExpenses: totalExpenses.toFixed(2) 
  };
};
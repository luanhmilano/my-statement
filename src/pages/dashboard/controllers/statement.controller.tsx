import { useEffect, useState } from 'react';
import StatementView from '../views/statement.view';
import type { StatementItem } from '../types';
import { fetchBalance, fetchStatement } from '@/services/statement.api';
import { getExpensesEarnings } from '../utils/get-expenses-earnings';

export default function StatementController() {
  const [statementData, setStatementData] = useState<StatementItem[]>([]);
  const [balanceTotal, setBalanceTotal] = useState<{
    balance: number;
    expenses: number;
    earnings: number;
  }>({ balance: 0, expenses: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatementData();
    loadBalance();
  }, []);

  const loadStatementData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }
      const statements = await fetchStatement(token);
      setStatementData(statements);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }
      const balanceAmount = await fetchBalance(token);
      const { totalEarnings, totalExpenses } =
        getExpensesEarnings(statementData);
      setBalanceTotal({
        balance: balanceAmount,
        expenses: totalExpenses,
        earnings: totalEarnings,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StatementView
      data={statementData}
      loading={loading}
      error={error}
      onRetry={loadStatementData}
      balanceTotal={balanceTotal}
    />
  );
}

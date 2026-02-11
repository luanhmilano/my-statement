import { useEffect, useState } from 'react';
import StatementView from '../views/statement.view';
import type { StatementItem } from '../types';
import { fetchBalance, fetchStatement } from '@/services/statement.api';
import { getExpensesEarnings } from '../utils/get-expenses-earnings';
import { useAuth } from '@/auth/hooks/useAuth';

export default function StatementController() {
  const [statementData, setStatementData] = useState<StatementItem[]>([]);
  const [balanceTotal, setBalanceTotal] = useState<{
    balance: number;
    expenses: string;
    earnings: string;
  }>({ balance: 0, expenses: '0.00', earnings: '0.00' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const [statements, balanceAmount] = await Promise.all([
        fetchStatement(token),
        fetchBalance(token)
      ]);
      
      setStatementData(statements);
      
      const { totalEarnings, totalExpenses } = getExpensesEarnings(statements);
      
      setBalanceTotal({
        balance: balanceAmount,
        expenses: totalExpenses,
        earnings: totalEarnings,
      });

      console.log('Balance total:', {
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
      onRetry={loadData}
      balanceTotal={balanceTotal}
    />
  );
}

import type { StatementItem } from '@/pages/dashboard/types';
import { getExpensesEarnings } from '@/pages/dashboard/utils/get-expenses-earnings';
import { describe, it, expect } from 'vitest';

describe('getExpensesEarnings', () => {
  it('should return zero earnings and expenses for empty array', () => {
    const result = getExpensesEarnings([]);

    expect(result.totalEarnings).toBe('0.00');
    expect(result.totalExpenses).toBe('0.00');
  });

  it('should calculate earnings correctly with only deposits', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Deposit',
        amount: 100.5,
        description: 'Salary',
        date: '2024-01-01',
        card: '1234',
      },
      {
        id: 2,
        type: 'Deposit',
        amount: 250.25,
        description: 'Freelance',
        date: '2024-01-15',
        card: '5678',
      },
      {
        id: 3,
        type: 'Deposit',
        amount: 75.0,
        description: 'Gift',
        date: '2024-01-20',
        card: '9012',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('425.75');
    expect(result.totalExpenses).toBe('0.00');
  });

  it('should calculate expenses correctly with only withdrawals', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Withdrawal',
        amount: 50.25,
        description: 'Groceries',
        date: '2024-01-05',
        card: '1234',
      },
      {
        id: 2,
        type: 'Withdrawal',
        amount: 100.0,
        description: 'Rent',
        date: '2024-01-10',
        card: '5678',
      },
      {
        id: 3,
        type: 'Withdrawal',
        amount: 25.5,
        description: 'Utilities',
        date: '2024-01-15',
        card: '9012',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('0.00');
    expect(result.totalExpenses).toBe('175.75');
  });

  it('should calculate expenses correctly with only transfers', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Transfer',
        amount: 200.0,
        description: 'Transfer to savings',
        date: '2024-01-05',
        card: '1234',
      },
      {
        id: 2,
        type: 'Transfer',
        amount: 150.75,
        description: 'Transfer to investment',
        date: '2024-01-10',
        card: '5678',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('0.00');
    expect(result.totalExpenses).toBe('350.75');
  });

  it('should calculate both earnings and expenses with mixed transaction types', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Deposit',
        amount: 1000.0,
        description: 'Salary',
        date: '2024-01-01',
        card: '1234',
      },
      {
        id: 2,
        type: 'Withdrawal',
        amount: 150.25,
        description: 'Groceries',
        date: '2024-01-05',
        card: '5678',
      },
      {
        id: 3,
        type: 'Transfer',
        amount: 200.5,
        description: 'Transfer to savings',
        date: '2024-01-10',
        card: '9012',
      },
      {
        id: 4,
        type: 'Deposit',
        amount: 500.75,
        description: 'Freelance',
        date: '2024-01-15',
        card: '3456',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('1500.75');
    expect(result.totalExpenses).toBe('350.75');
  });

  it('should handle decimal amounts correctly', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Deposit',
        amount: 123.456,
        description: 'Test Deposit',
        date: '2024-01-01',
        card: '1234',
      },
      {
        id: 2,
        type: 'Withdrawal',
        amount: 67.891,
        description: 'Test Withdrawal',
        date: '2024-01-02',
        card: '5678',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('123.46');
    expect(result.totalExpenses).toBe('67.89');
  });

  it('should return values as strings with 2 decimal places', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Deposit',
        amount: 100,
        description: 'Test Deposit',
        date: '2024-01-01',
        card: '1234',
      },
      {
        id: 2,
        type: 'Withdrawal',
        amount: 50,
        description: 'Test Withdrawal',
        date: '2024-01-02',
        card: '5678',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(typeof result.totalEarnings).toBe('string');
    expect(typeof result.totalExpenses).toBe('string');
    expect(result.totalEarnings).toBe('100.00');
    expect(result.totalExpenses).toBe('50.00');
  });

  it('should ignore unknown transaction types', () => {
    const data: StatementItem[] = [
      {
        id: 1,
        type: 'Deposit',
        amount: 100.0,
        description: 'Test Deposit',
        date: '2024-01-01',
        card: '1234',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        id: 2,
        type: 'Unknown' as any,
        amount: 50.0,
        description: 'Unknown Transaction',
        date: '2024-01-02',
        card: '5678',
      },
      {
        id: 3,
        type: 'Withdrawal',
        amount: 25.0,
        description: 'Test Withdrawal',
        date: '2024-01-03',
        card: '9012',
      },
    ];

    const result = getExpensesEarnings(data);

    expect(result.totalEarnings).toBe('100.00');
    expect(result.totalExpenses).toBe('25.00');
  });
});

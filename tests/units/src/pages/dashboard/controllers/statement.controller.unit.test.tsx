import StatementController from '@/pages/dashboard/controllers/statement.controller';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { StatementItem } from '@/pages/dashboard/types';
import { fetchBalance, fetchStatement } from '@/services/statement.api';
import { useAuth } from '@/auth/hooks/useAuth';
import { getExpensesEarnings } from '@/pages/dashboard/utils/get-expenses-earnings';
import { act } from 'react';

vi.mock('@/pages/dashboard/views/statement.view', () => ({
  default: vi.fn(({ data, loading, error, onRetry, balanceTotal }) => (
    <div data-testid="statement-view">
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="data-length">{data.length}</div>
      <div data-testid="balance">{balanceTotal.balance}</div>
      <div data-testid="expenses">{balanceTotal.expenses}</div>
      <div data-testid="earnings">{balanceTotal.earnings}</div>
      <button data-testid="retry-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )),
}));

vi.mock('@/services/statement.api', () => ({
  fetchStatement: vi.fn(),
  fetchBalance: vi.fn(),
}));

vi.mock('@/pages/dashboard/utils/get-expenses-earnings', () => ({
  getExpensesEarnings: vi.fn(),
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockFetchStatement = vi.mocked(fetchStatement);
const mockFetchBalance = vi.mocked(fetchBalance);
const mockGetExpensesEarnings = vi.mocked(getExpensesEarnings);
const mockUseAuth = vi.mocked(useAuth);

describe('StatementController', () => {
  const mockStatementData: StatementItem[] = [
    {
      id: 1,
      description: 'Test transaction',
      amount: 100,
      date: '2023-01-01',
      type: 'Deposit',
      card: '1234',
    },
    {
      id: 2,
      description: 'Another transaction',
      amount: -50,
      date: '2023-01-02',
      type: 'Withdrawal',
      card: '5678',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});

    mockUseAuth.mockReturnValue({
      token: 'mock-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
    mockFetchStatement.mockResolvedValue(mockStatementData);
    mockFetchBalance.mockResolvedValue(1500);
    mockGetExpensesEarnings.mockReturnValue({
      totalEarnings: '100.00',
      totalExpenses: '50.00',
    });
  });

  it('should render with initial loading state', () => {
    act(() => {
      render(<StatementController />);
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(screen.getByTestId('data-length')).toHaveTextContent('0');
    expect(screen.getByTestId('balance')).toHaveTextContent('0');
    expect(screen.getByTestId('expenses')).toHaveTextContent('0.00');
    expect(screen.getByTestId('earnings')).toHaveTextContent('0.00');
  });

  it('should load data successfully when token is available', async () => {
    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(mockFetchStatement).toHaveBeenCalledWith('mock-token');
    expect(mockFetchBalance).toHaveBeenCalledWith('mock-token');
    expect(mockGetExpensesEarnings).toHaveBeenCalledWith(mockStatementData);

    expect(screen.getByTestId('data-length')).toHaveTextContent('2');
    expect(screen.getByTestId('balance')).toHaveTextContent('1500');
    expect(screen.getByTestId('expenses')).toHaveTextContent('50.00');
    expect(screen.getByTestId('earnings')).toHaveTextContent('100.00');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should handle error when no token is available', async () => {
    mockUseAuth.mockReturnValue({
      token: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'No authentication token found.'
    );
    expect(mockFetchStatement).not.toHaveBeenCalled();
    expect(mockFetchBalance).not.toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network error occurred';
    mockFetchStatement.mockRejectedValue(new Error(errorMessage));

    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
  });

  it('should handle non-Error exceptions', async () => {
    mockFetchStatement.mockRejectedValue('String error');

    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('error')).toHaveTextContent('An error occurred');
  });

  it('should retry loading data when onRetry is called', async () => {
    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Clear previous calls
    mockFetchStatement.mockClear();
    mockFetchBalance.mockClear();

    // Click retry button
    screen.getByTestId('retry-button').click();

    await waitFor(() => {
      expect(mockFetchStatement).toHaveBeenCalledWith('mock-token');
      expect(mockFetchBalance).toHaveBeenCalledWith('mock-token');
    });
  });

  it('should reload data when token changes', async () => {
    const { rerender } = render(<StatementController />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Clear previous calls
    mockFetchStatement.mockClear();
    mockFetchBalance.mockClear();

    // Change token
    mockUseAuth.mockReturnValue({
      token: 'new-token',
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
    rerender(<StatementController />);

    await waitFor(() => {
      expect(mockFetchStatement).toHaveBeenCalledWith('new-token');
      expect(mockFetchBalance).toHaveBeenCalledWith('new-token');
    });
  });

  it('should log balance total information', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    act(() => {
      render(<StatementController />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Balance total:', {
      balance: 1500,
      expenses: '50.00',
      earnings: '100.00',
    });
  });
});

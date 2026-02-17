/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type {
  StatementItem,
  StatementViewProps,
} from '@/pages/dashboard/types';
import StatementView from '@/pages/dashboard/views/statement.view';

vi.mock('@/pages/dashboard/styles/statement.module.css', () => ({
  default: {
    container: 'container',
    balanceTopHeader: 'balanceTopHeader',
    errorContainer: 'errorContainer',
    errorMessage: 'errorMessage',
    retryButton: 'retryButton',
    contentArea: 'contentArea',
  },
}));

vi.mock('@/pages/dashboard/components/balance-top', () => ({
  default: ({ amount, title, type }: any) => (
    <div
      data-testid="balance-top"
      data-amount={amount}
      data-title={title}
      data-type={type}
    >
      BalanceTop - {title}
    </div>
  ),
}));

vi.mock('@/pages/dashboard/components/paginated-table', () => ({
  default: ({ data }: any) => (
    <div data-testid="paginated-table" data-length={data?.length || 0}>
      PaginatedTable
    </div>
  ),
}));

vi.mock('react-icons/lu', () => ({
  LuWallet: () => <div data-testid="wallet-icon">WalletIcon</div>,
  LuReceipt: () => <div data-testid="receipt-icon">ReceiptIcon</div>,
}));

describe('StatementView', () => {
  const mockOnRetry = vi.fn();

  const defaultProps: StatementViewProps = {
    data: [
      {
        id: 1,
        description: 'Test transaction',
        type: 'Deposit',
        date: '2024-01-15',
        amount: 100,
        card: '**** 1234',
      },
    ],
    loading: false,
    error: null,
    onRetry: mockOnRetry,
    balanceTotal: {
      balance: 1000.0,
      expenses: '200.00',
      earnings: '1200.00',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<StatementView {...defaultProps} />);

    expect(screen.getByText('BalanceTop - Money')).toBeInTheDocument();
    expect(screen.getByText('PaginatedTable')).toBeInTheDocument();
  });

  describe('Balance Top Components', () => {
    it('renders all three balance top components with correct props', () => {
      render(<StatementView {...defaultProps} />);

      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents).toHaveLength(3);

      // Check Money balance
      const moneyBalance = screen.getByText('BalanceTop - Money');
      expect(moneyBalance).toBeInTheDocument();
      expect(
        moneyBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-amount', '1000');
      expect(
        moneyBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-type', 'money');

      // Check Expenses balance
      const expensesBalance = screen.getByText('BalanceTop - Expenses');
      expect(expensesBalance).toBeInTheDocument();
      expect(
        expensesBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-amount', '200.00');
      expect(
        expensesBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-type', 'expenses');

      // Check Earnings balance
      const earningsBalance = screen.getByText('BalanceTop - Earnings');
      expect(earningsBalance).toBeInTheDocument();
      expect(
        earningsBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-amount', '1200.00');
      expect(
        earningsBalance.closest('[data-testid="balance-top"]')
      ).toHaveAttribute('data-type', 'earnings');
    });

    it('passes correct titles to balance top components', () => {
      render(<StatementView {...defaultProps} />);

      expect(screen.getByText('BalanceTop - Money')).toBeInTheDocument();
      expect(screen.getByText('BalanceTop - Expenses')).toBeInTheDocument();
      expect(screen.getByText('BalanceTop - Earnings')).toBeInTheDocument();
    });

    it('renders balance components with correct amounts format', () => {
      const propsWithDecimals = {
        ...defaultProps,
        balanceTotal: {
          balance: 1250.5,
          expenses: '500.75',
          earnings: '1,751.25',
        },
      };

      render(<StatementView {...propsWithDecimals} />);

      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents[0]).toHaveAttribute('data-amount', '1250.5');
      expect(balanceTopComponents[1]).toHaveAttribute('data-amount', '500.75');
      expect(balanceTopComponents[2]).toHaveAttribute(
        'data-amount',
        '1,751.25'
      );
    });

    it('renders balance components with zero values', () => {
      const propsWithZeros = {
        ...defaultProps,
        balanceTotal: {
          balance: 0.0,
          expenses: '0.00',
          earnings: '0.00',
        },
      };

      render(<StatementView {...propsWithZeros} />);

      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents[0]).toHaveAttribute('data-amount', '0');
      expect(balanceTopComponents[1]).toHaveAttribute('data-amount', '0.00');
      expect(balanceTopComponents[2]).toHaveAttribute('data-amount', '0.00');
    });
  });

  describe('Error State', () => {
    it('renders error message when error prop is provided', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      render(<StatementView {...propsWithError} />);

      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      render(<StatementView {...propsWithError} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      fireEvent.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('does not render paginated table when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      render(<StatementView {...propsWithError} />);

      expect(screen.queryByText('PaginatedTable')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes to error elements', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      const { container } = render(<StatementView {...propsWithError} />);

      expect(container.querySelector('.errorContainer')).toBeInTheDocument();
      expect(container.querySelector('.errorMessage')).toBeInTheDocument();
      expect(container.querySelector('.retryButton')).toBeInTheDocument();
    });

    it('renders different error messages correctly', () => {
      const networkError = {
        ...defaultProps,
        error: 'Network connection failed',
      };

      const { rerender } = render(<StatementView {...networkError} />);
      expect(screen.getByText('Network connection failed')).toBeInTheDocument();

      const serverError = {
        ...defaultProps,
        error: 'Server error 500',
      };

      rerender(<StatementView {...serverError} />);
      expect(screen.getByText('Server error 500')).toBeInTheDocument();
    });

    it('calls onRetry multiple times when retry button is clicked multiple times', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      render(<StatementView {...propsWithError} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });

      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(3);
    });

    it('still renders balance components when error occurs', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Failed to load data',
      };

      render(<StatementView {...propsWithError} />);

      expect(screen.getByText('BalanceTop - Money')).toBeInTheDocument();
      expect(screen.getByText('BalanceTop - Expenses')).toBeInTheDocument();
      expect(screen.getByText('BalanceTop - Earnings')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loading message when loading is true', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true,
      };

      render(<StatementView {...loadingProps} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not render paginated table when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true,
      };

      render(<StatementView {...loadingProps} />);

      expect(screen.queryByText('PaginatedTable')).not.toBeInTheDocument();
    });

    it('still renders balance top components when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true,
      };

      render(<StatementView {...loadingProps} />);

      expect(screen.getAllByTestId('balance-top')).toHaveLength(3);
    });

    it('does not render error container when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true,
      };

      const { container } = render(<StatementView {...loadingProps} />);

      expect(
        container.querySelector('.errorContainer')
      ).not.toBeInTheDocument();
    });

    it('does not render content area when loading', () => {
      const loadingProps = {
        ...defaultProps,
        loading: true,
      };

      const { container } = render(<StatementView {...loadingProps} />);

      expect(container.querySelector('.contentArea')).not.toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders paginated table when not loading and no error', () => {
      render(<StatementView {...defaultProps} />);

      expect(screen.getByText('PaginatedTable')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('passes data to paginated table correctly', () => {
      render(<StatementView {...defaultProps} />);

      const paginatedTable = screen.getByTestId('paginated-table');
      expect(paginatedTable).toHaveAttribute('data-length', '1');
    });

    it('renders content area with correct CSS class', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      expect(container.querySelector('.contentArea')).toBeInTheDocument();
    });

    it('renders paginated table with multiple data items', () => {
      const multipleDataProps = {
        ...defaultProps,
        data: [
          {
            id: 1,
            description: 'Transaction 1',
            type: 'Deposit',
            date: '2024-01-15',
            amount: 100,
            card: '**** 1234',
          },
          {
            id: 2,
            description: 'Transaction 2',
            type: 'Withdrawal',
            date: '2024-01-16',
            amount: 50,
            card: '**** 1234',
          },
          {
            id: 3,
            description: 'Transaction 3',
            type: 'Transfer',
            date: '2024-01-17',
            amount: 25,
            card: '**** 1234',
          },
        ] as StatementItem[],
      };

      render(<StatementView {...multipleDataProps} />);

      const paginatedTable = screen.getByTestId('paginated-table');
      expect(paginatedTable).toHaveAttribute('data-length', '3');
    });
  });

  describe('Layout Structure', () => {
    it('applies correct CSS classes to main elements', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      expect(container.firstChild).toHaveClass('container');
      expect(container.querySelector('.balanceTopHeader')).toBeInTheDocument();
    });

    it('renders balance top header before other content', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      const balanceHeader = container.querySelector('.balanceTopHeader');
      const contentArea = container.querySelector('.contentArea');

      expect(balanceHeader).toBeInTheDocument();
      expect(contentArea).toBeInTheDocument();

      // Balance header should come before content area in DOM
      expect(balanceHeader!.compareDocumentPosition(contentArea!)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it('contains all balance top components within balance header', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      const balanceHeader = container.querySelector('.balanceTopHeader');
      const balanceTopComponents = container.querySelectorAll(
        '[data-testid="balance-top"]'
      );

      balanceTopComponents.forEach(component => {
        expect(balanceHeader?.contains(component)).toBe(true);
      });
    });

    it('renders with correct container structure', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      const mainContainer = container.querySelector('.container');
      const balanceHeader = container.querySelector('.balanceTopHeader');
      const contentArea = container.querySelector('.contentArea');

      expect(mainContainer?.contains(balanceHeader!)).toBe(true);
      expect(mainContainer?.contains(contentArea!)).toBe(true);
    });

    it('maintains proper DOM hierarchy', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      expect(container.children).toHaveLength(1);
      expect(container.firstChild).toHaveClass('container');
    });
  });

  describe('Conditional Rendering Logic', () => {
    it('does not render loading text when not loading', () => {
      render(<StatementView {...defaultProps} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('does not render error container when no error', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      expect(
        container.querySelector('.errorContainer')
      ).not.toBeInTheDocument();
    });

    it('handles both loading and error states correctly', () => {
      const propsWithBoth = {
        ...defaultProps,
        loading: true,
        error: 'Some error',
      };

      render(<StatementView {...propsWithBoth} />);

      expect(screen.getByText('Some error')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('PaginatedTable')).not.toBeInTheDocument();
    });

    it('renders content area only when not loading and no error', () => {
      const { container } = render(<StatementView {...defaultProps} />);

      expect(container.querySelector('.contentArea')).toBeInTheDocument();

      // Test with loading
      const { container: loadingContainer } = render(
        <StatementView {...defaultProps} loading={true} />
      );
      expect(
        loadingContainer.querySelector('.contentArea')
      ).not.toBeInTheDocument();

      // Test with error
      const { container: errorContainer } = render(
        <StatementView {...defaultProps} error="Error" />
      );
      expect(
        errorContainer.querySelector('.contentArea')
      ).not.toBeInTheDocument();
    });

    it('prioritizes error display over loading when both are present', () => {
      const propsWithBoth = {
        ...defaultProps,
        loading: true,
        error: 'Critical error',
      };

      render(<StatementView {...propsWithBoth} />);

      expect(screen.getByText('Critical error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('shows only balance components when both loading and error', () => {
      const propsWithBoth = {
        ...defaultProps,
        loading: true,
        error: 'Some error',
      };

      const { container } = render(<StatementView {...propsWithBoth} />);

      expect(screen.getAllByTestId('balance-top')).toHaveLength(3);
      expect(container.querySelector('.contentArea')).not.toBeInTheDocument();
    });
  });

  describe('Props handling', () => {
    it('handles empty data array correctly', () => {
      const emptyDataProps = {
        ...defaultProps,
        data: [],
      };

      render(<StatementView {...emptyDataProps} />);

      const paginatedTable = screen.getByTestId('paginated-table');
      expect(paginatedTable).toHaveAttribute('data-length', '0');
    });

    it('handles different balance total values', () => {
      const differentBalanceProps = {
        ...defaultProps,
        balanceTotal: {
          balance: 500.75,
          expenses: '300.25',
          earnings: '800.00',
        },
      };

      render(<StatementView {...differentBalanceProps} />);

      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents[0]).toHaveAttribute('data-amount', '500.75');
      expect(balanceTopComponents[1]).toHaveAttribute('data-amount', '300.25');
      expect(balanceTopComponents[2]).toHaveAttribute('data-amount', '800.00');
    });

    it('handles null/undefined data gracefully', () => {
      const nullDataProps = {
        ...defaultProps,
        data: null as any,
      };

      render(<StatementView {...nullDataProps} />);

      const paginatedTable = screen.getByTestId('paginated-table');
      expect(paginatedTable).toHaveAttribute('data-length', '0');
    });

    it('handles negative balance values', () => {
      const negativeBalanceProps = {
        ...defaultProps,
        balanceTotal: {
          balance: -250.5,
          expenses: '1000.00',
          earnings: '750.00',
        },
      };

      render(<StatementView {...negativeBalanceProps} />);

      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents[0]).toHaveAttribute('data-amount', '-250.5');
    });

    it('maintains component state between prop updates', () => {
      const { rerender } = render(<StatementView {...defaultProps} />);

      expect(screen.getByText('PaginatedTable')).toBeInTheDocument();

      const updatedProps = {
        ...defaultProps,
        balanceTotal: {
          balance: 2000.0,
          expenses: '500.00',
          earnings: '2500.00',
        },
      };

      rerender(<StatementView {...updatedProps} />);

      expect(screen.getByText('PaginatedTable')).toBeInTheDocument();
      const balanceTopComponents = screen.getAllByTestId('balance-top');
      expect(balanceTopComponents[0]).toHaveAttribute('data-amount', '2000');
    });
  });

  describe('Accessibility', () => {
    it('maintains proper button accessibility for retry button', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Connection failed',
      };

      render(<StatementView {...propsWithError} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toHaveAttribute('disabled');
    });

    it('provides meaningful error messages', () => {
      const propsWithError = {
        ...defaultProps,
        error: 'Unable to fetch statement data. Please check your connection.',
      };

      render(<StatementView {...propsWithError} />);

      expect(
        screen.getByText(
          'Unable to fetch statement data. Please check your connection.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Performance considerations', () => {
    it('does not re-render unnecessarily when props remain the same', () => {
      const { rerender } = render(<StatementView {...defaultProps} />);

      // Re-render with same props
      rerender(<StatementView {...defaultProps} />);

      expect(screen.getByText('PaginatedTable')).toBeInTheDocument();
      expect(screen.getAllByTestId('balance-top')).toHaveLength(3);
    });

    it('handles rapid state changes correctly', () => {
      const { rerender } = render(<StatementView {...defaultProps} />);

      // Loading state
      rerender(<StatementView {...defaultProps} loading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Error state
      rerender(<StatementView {...defaultProps} error="Error occurred" />);
      expect(screen.getByText('Error occurred')).toBeInTheDocument();

      // Back to normal state
      rerender(<StatementView {...defaultProps} />);
      expect(screen.getByText('PaginatedTable')).toBeInTheDocument();
    });
  });
});

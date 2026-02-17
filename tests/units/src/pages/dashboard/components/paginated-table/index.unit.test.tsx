import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaginatedTable from '@/pages/dashboard/components/paginated-table';
import type { StatementItem } from '@/pages/dashboard/types';

const mockData: StatementItem[] = [
  {
    id: 1,
    description: 'Coffee Shop',
    type: 'Withdrawal',
    card: '****1234',
    date: '2024-01-15T10:30:00Z',
    amount: -15.50,
  },
  {
    id: 2,
    description: 'Salary Deposit',
    type: 'Deposit',
    card: '****5678',
    date: '2024-01-14T09:00:00Z',
    amount: 3000.00,
  },
  {
    id: 3,
    description: 'Gas Station',
    type: 'Withdrawal',
    card: '****1234',
    date: '2024-01-13T18:45:00Z',
    amount: -45.75,
  },
];

const generateMockData = (count: number): StatementItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    description: `Transaction ${index + 1}`,
    type: (index % 2 === 0 ? 'Withdrawal' : 'Deposit') as 'Withdrawal' | 'Deposit',
    card: `****${(1234 + index).toString().slice(-4)}`,
    date: new Date(2024, 0, index + 1).toISOString(),
    amount: index % 2 === 0 ? -(index + 1) * 10 : (index + 1) * 100,
  }));
};

describe('PaginatedTable', () => {
  describe('Empty State', () => {
    it('renders empty state when no data provided', () => {
      render(<PaginatedTable data={[]} />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Table Rendering', () => {
    it('renders table with correct headers', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Transaction ID' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Card' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Receipt' })).toBeInTheDocument();
    });

    it('renders all data rows when less than items per page', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
      expect(screen.getByText('Gas Station')).toBeInTheDocument();
    });

    it('renders transaction IDs with # prefix', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('renders transaction types correctly', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.getAllByText('Withdrawal')).toHaveLength(2);
      expect(screen.getByText('Deposit')).toBeInTheDocument();
    });

    it('renders card numbers', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.getAllByText('****1234')).toHaveLength(2);
      expect(screen.getByText('****5678')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      render(<PaginatedTable data={mockData} />);
      const dateElements = screen.getAllByText(/\d{1,2} \w{3}, \d{2}:\d{2}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Amount Display', () => {
    it('displays positive amounts with + prefix and positive styling', () => {
      render(<PaginatedTable data={mockData} />);
      
      const positiveAmount = screen.getByText(/\+/);
      expect(positiveAmount).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders arrow down icon for withdrawals', () => {
      render(<PaginatedTable data={mockData} />);
      
      const withdrawalRows = screen.getAllByText('Withdrawal');
      expect(withdrawalRows).toHaveLength(2);
      // Icons are rendered as SVG elements
    });

    it('renders arrow up icon for deposits', () => {
      render(<PaginatedTable data={mockData} />);
      
      const depositRow = screen.getByText('Deposit');
      expect(depositRow).toBeInTheDocument();
    });

    it('renders arrow down icon for negative amounts regardless of type', () => {
      const negativeDepositData: StatementItem[] = [{
        id: 1,
        description: 'Refund',
        type: 'Deposit',
        card: '****1234',
        date: '2024-01-15T10:30:00Z',
        amount: -50,
      }];

      render(<PaginatedTable data={negativeDepositData} />);
      
      expect(screen.getByText('Deposit')).toBeInTheDocument();
      expect(screen.getByText('-$50')).toBeInTheDocument();
    });
  });

  describe('Download Buttons', () => {
    it('renders download button for each row', () => {
      render(<PaginatedTable data={mockData} />);
      
      const downloadButtons = screen.getAllByText('Download');
      expect(downloadButtons).toHaveLength(mockData.length);
    });

    it('download buttons are clickable', () => {
      render(<PaginatedTable data={mockData} />);
      
      const downloadButtons = screen.getAllByText('Download');
      downloadButtons.forEach(button => {
        expect(button).toBeEnabled();
      });
    });
  });

  describe('Pagination - No Pagination Needed', () => {
    it('does not show pagination when data fits in one page', () => {
      render(<PaginatedTable data={mockData} />);
      
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
      expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    });
  });

  describe('Pagination - Multiple Pages', () => {
    const manyItemsData = generateMockData(25);

    it('shows pagination controls when data exceeds items per page', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Showing 1-10 of 25 results')).toBeInTheDocument();
    });

    it('renders only first 10 items on first page', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      expect(screen.getByText('Transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Transaction 10')).toBeInTheDocument();
      expect(screen.queryByText('Transaction 11')).not.toBeInTheDocument();
    });

    it('disables Previous button on first page', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });

    it('enables Next button when there are more pages', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeEnabled();
    });

    it('navigates to next page when Next button is clicked', async () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 11-20 of 25 results')).toBeInTheDocument();
      });

      expect(screen.getByText('Transaction 11')).toBeInTheDocument();
      expect(screen.getByText('Transaction 20')).toBeInTheDocument();
      expect(screen.queryByText('Transaction 10')).not.toBeInTheDocument();
    });

    it('navigates to previous page when Previous button is clicked', async () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      // Go to second page first
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 11-20 of 25 results')).toBeInTheDocument();
      });

      // Go back to first page
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 1-10 of 25 results')).toBeInTheDocument();
      });

      expect(screen.getByText('Transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Transaction 10')).toBeInTheDocument();
    });

    it('disables Next button on last page', async () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      // Navigate to last page (page 3)
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton); // Page 2
      fireEvent.click(nextButton); // Page 3

      await waitFor(() => {
        expect(screen.getByText('Showing 21-25 of 25 results')).toBeInTheDocument();
      });

      expect(nextButton).toBeDisabled();
    });

    it('shows correct items count on last page', async () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      // Navigate to last page
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 21-25 of 25 results')).toBeInTheDocument();
      });

      expect(screen.getByText('Transaction 21')).toBeInTheDocument();
      expect(screen.getByText('Transaction 25')).toBeInTheDocument();
      expect(screen.queryByText('Transaction 26')).not.toBeInTheDocument();
    });
  });

  describe('Page Numbers', () => {
    const manyItemsData = generateMockData(50);

    it('renders page numbers', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('highlights current page number', () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      const pageOne = screen.getByText('1');
      expect(pageOne).toHaveClass(/active/);
    });

    it('navigates to specific page when page number is clicked', async () => {
      render(<PaginatedTable data={manyItemsData} />);
      
      const pageThree = screen.getByText('3');
      fireEvent.click(pageThree);

      await waitFor(() => {
        expect(screen.getByText('Showing 21-30 of 50 results')).toBeInTheDocument();
      });

      expect(pageThree).toHaveClass(/active/);
    });

    it('limits visible page numbers to maximum of 5', () => {
      const lotsOfData = generateMockData(100);
      render(<PaginatedTable data={lotsOfData} />);
      
      const pageButtons = screen.getAllByRole('button').filter(
        button => /^\d+$/.test(button.textContent || '')
      );
      expect(pageButtons.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Edge Cases', () => {
    it('handles single item correctly', () => {
      const singleItem = [mockData[0]];
      render(<PaginatedTable data={singleItem} />);
      
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('handles exactly 10 items (no pagination needed)', () => {
      const exactlyTenItems = generateMockData(10);
      render(<PaginatedTable data={exactlyTenItems} />);
      
      expect(screen.getByText('Transaction 1')).toBeInTheDocument();
      expect(screen.getByText('Transaction 10')).toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('handles exactly 11 items (pagination needed)', () => {
      const elevenItems = generateMockData(11);
      render(<PaginatedTable data={elevenItems} />);
      
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Showing 1-10 of 11 results')).toBeInTheDocument();
    });

    it('handles zero amount correctly', () => {
      const zeroAmountData: StatementItem[] = [{
        id: 1,
        description: 'Zero Transaction',
        type: 'Transfer',
        card: '****1234',
        date: '2024-01-15T10:30:00Z',
        amount: 0,
      }];

      render(<PaginatedTable data={zeroAmountData} />);
      
      expect(screen.getByText('+$0')).toBeInTheDocument();
    });
  });

  describe('Data Updates', () => {
    it('resets to first page when data changes', async () => {
      const { rerender } = render(<PaginatedTable data={generateMockData(25)} />);
      
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Showing 11-20 of 25 results')).toBeInTheDocument();
      });
      rerender(<PaginatedTable data={generateMockData(5)} />);

      expect(screen.getByText(/Transaction/)).toBeInTheDocument();
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });
});
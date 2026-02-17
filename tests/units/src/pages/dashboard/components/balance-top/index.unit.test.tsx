import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BalanceTop from '@/pages/dashboard/components/balance-top';

const MockIcon = () => <svg data-testid="mock-icon" />;

describe('BalanceTop', () => {
  it('renders with required props', () => {
    render(
      <BalanceTop
        icon={MockIcon}
        title="Test Balance"
        amount="1000.00"
        type="default"
      />
    );

    expect(screen.getByText('Test Balance')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders without icon when not provided', () => {
    render(<BalanceTop title="Test Balance" amount="1000.00" type="default" />);

    expect(screen.getByText('Test Balance')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });

  it('renders with default type when not specified', () => {
    const { container } = render(
      <BalanceTop title="Test Balance" amount="1000.00" type="default" />
    );

    const balanceElement = container.firstChild as HTMLElement;
    expect(balanceElement).toHaveAttribute('data-type', 'default');
  });

  it('renders with money type', () => {
    const { container } = render(
      <BalanceTop title="Money Balance" amount="5000.00" type="money" />
    );

    const balanceElement = container.firstChild as HTMLElement;
    expect(balanceElement).toHaveAttribute('data-type', 'money');
  });

  it('renders with expenses type', () => {
    const { container } = render(
      <BalanceTop title="Expenses" amount="2000.00" type="expenses" />
    );

    const balanceElement = container.firstChild as HTMLElement;
    expect(balanceElement).toHaveAttribute('data-type', 'expenses');
  });

  it('renders with earnings type', () => {
    const { container } = render(
      <BalanceTop title="Earnings" amount="3000.00" type="earnings" />
    );

    const balanceElement = container.firstChild as HTMLElement;
    expect(balanceElement).toHaveAttribute('data-type', 'earnings');
  });

  it('formats amount with dollar sign', () => {
    render(<BalanceTop title="Test" amount="123.45" type="default" />);

    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <BalanceTop icon={MockIcon} title="Test" amount="100.00" type="default" />
    );

    const titleElement = screen.getByText('Test');
    const amountElement = screen.getByText('$100.00');

    expect(titleElement).toHaveClass(/balanceTitle/);
    expect(amountElement).toHaveClass(/balanceAmount/);
  });
});

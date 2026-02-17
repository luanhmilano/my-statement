import { processStatementData } from '@/pages/dashboard/utils/process-statement-data';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('processStatementData', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  it('should process valid complete data correctly', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '150.50'
      }
    ];

    const result = processStatementData(rawData);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'test-123',
      description: 'Test transaction',
      type: 'Deposit',
      date: new Date('2024-01-15T10:30:00Z').toLocaleDateString(),
      amount: 150.50,
      card: '**** 1234'
    });
  });

  it('should use default description when description is missing', () => {
    const rawData = [
      {
        id: 'test-123',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00'
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].description).toBe('No description');
  });

  it('should use default type when type is missing', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00'
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].type).toBe('Uncategorized');
  });

  it('should default to 0 when amount is missing', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z'
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].amount).toBe(0);
  });

  it('should default to 0 when amount is invalid', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: 'invalid-amount'
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].amount).toBe(0);
  });

  it('should parse numeric amounts correctly', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: 123.45
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].amount).toBe(123.45);
  });

  it('should format date correctly', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00'
      }
    ];

    const result = processStatementData(rawData);
    const expectedDate = new Date('2024-01-15T10:30:00Z').toLocaleDateString();

    expect(result[0].date).toBe(expectedDate);
  });

  it('should return empty array for empty input', () => {
    const result = processStatementData([]);

    expect(result).toEqual([]);
  });

  it('should always set card to "**** 1234"', () => {
    const rawData = [
      {
        id: 'test-123',
        description: 'Test transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00',
        card: 'some-other-card'
      }
    ];

    const result = processStatementData(rawData);

    expect(result[0].card).toBe('**** 1234');
  });

  it('should process multiple items correctly', () => {
    const rawData = [
      {
        id: 'test-1',
        description: 'First transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00'
      },
      {
        id: 'test-2',
        description: 'Second transaction',
        type: 'Withdrawal',
        created_at: '2024-01-16T14:45:00Z',
        amount: '50.25'
      }
    ];

    const result = processStatementData(rawData);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('test-1');
    expect(result[1].id).toBe('test-2');
    expect(result[0].amount).toBe(100.00);
    expect(result[1].amount).toBe(50.25);
  });

  it('should handle mixed valid and invalid data', () => {
    const rawData = [
      {
        description: 'Valid transaction',
        type: 'Deposit',
        created_at: '2024-01-15T10:30:00Z',
        amount: '100.00'
      },
      {
        id: 'test-2',
        created_at: '2024-01-16T14:45:00Z',
        amount: 'invalid'
      }
    ];

    const result = processStatementData(rawData);

    expect(result).toHaveLength(2);
    expect(result[0].description).toBe('Valid transaction');
    expect(result[1].description).toBe('No description');
    expect(result[1].type).toBe('Uncategorized');
    expect(result[1].amount).toBe(0);
  });
});
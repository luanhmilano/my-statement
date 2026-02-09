/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StatementItem } from '@/pages/dashboard/types';

export function processStatementData(rawData: any[]): StatementItem[] {
  return rawData.map(item => ({
    id: item.id || Math.random().toString(36),
    description: item.description || 'No description',
    type: item.type || 'Uncategorized',
    date: new Date(item.date).toLocaleDateString(),
    amount: parseFloat(item.amount) || 0,
    card: '**** 1234',
  }));
}

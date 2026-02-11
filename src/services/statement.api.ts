import axios from 'axios';
import { getConfig } from '@/utils/get-config';
import { processStatementData } from '@/pages/dashboard/utils/process-statement-data';

const { API_URL } = getConfig();

export const fetchStatement = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/statements/?limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const statements = processStatementData(response.data);
    return statements;
  } catch (error) {
    console.error('Fetch statement error:', error);
    throw error;
  }
};

export const fetchBalance = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/balance/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.amount;
  } catch (error) {
    console.error('Fetch balance error:', error);
    throw error;
  }
};

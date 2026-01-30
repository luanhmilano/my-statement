import axios from 'axios';
import { getConfig } from '@/utils/get-config';
import type { UserData, UserAuthData } from './types';

const { USERS_URL, AUTH_URL } = getConfig();

export const createUser = async (userData: UserData): Promise<void> => {
  try {
    await axios.post(USERS_URL, JSON.stringify(userData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

export const authUser = async (authData: UserAuthData): Promise<string> => {
  try {
    const response = await axios.post(AUTH_URL, JSON.stringify(authData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Auth user error:', error);
    throw error;
  }
};

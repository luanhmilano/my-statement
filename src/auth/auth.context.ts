import { createContext } from 'react';
import type { AuthContextContract } from './types';

export const AuthContext = createContext<AuthContextContract | undefined>(
  undefined
);

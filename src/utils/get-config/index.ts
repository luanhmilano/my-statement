export interface ConfigProps {
  USERS_URL: string;
  AUTH_URL: string;
  API_URL: string;
}

export const getConfig = (): ConfigProps => {
  return {
    USERS_URL: import.meta.env.VITE_USERS_URL || '',
    AUTH_URL: import.meta.env.VITE_AUTH_URL || '',
    API_URL: import.meta.env.VITE_API_URL || '',
  };
};

export interface AuthContextContract {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
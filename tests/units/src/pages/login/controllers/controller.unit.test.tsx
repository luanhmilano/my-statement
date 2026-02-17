import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RoutesUrls } from '@/utils/enums/routes-url';
import LoginView from '@/pages/login/view/login.view';
import LoginController from '@/pages/login/index.page';
import type { LoginData } from '@/pages/login/utils/login-schema';

vi.mock('react-router-dom');
vi.mock('react-hook-form');
vi.mock('react-toastify');
vi.mock('axios');
vi.mock('@/services/api');
vi.mock('@/auth/hooks/useAuth');
vi.mock('@hookform/resolvers/zod');

vi.mock('@/services/auth.api', () => ({
  authUser: vi.fn(),
}));

vi.mock('@/pages/login/view/login.view', () => ({
  default: vi.fn(() => <div data-testid="login-view">Mock Login View</div>),
}));

describe('LoginController', () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockAuthUser = vi.fn();
  const mockLoginView = LoginView as Mock;
  const mockToastSuccess = vi.fn();
  const mockToastError = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    (useAuth as Mock).mockReturnValue({
      login: mockLogin,
    });

    (useForm as Mock).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
    });

    (toast.success as Mock).mockImplementation(mockToastSuccess);
    (toast.error as Mock).mockImplementation(mockToastError);

    (axios.isAxiosError as unknown as Mock).mockReturnValue(false);

    const { authUser } = await import('@/services/auth.api');
    (authUser as Mock).mockImplementation(mockAuthUser);
  });

  describe('Component rendering', () => {
    it('should render LoginView with correct props', () => {
      render(<LoginController />);

      expect(mockLoginView).toHaveBeenCalledTimes(1);
      const props = mockLoginView.mock.calls[0][0];

      expect(props).toHaveProperty('onSubmit');
      expect(props).toHaveProperty('isLoading', false);
      expect(props).toHaveProperty('register', mockRegister);
      expect(props).toHaveProperty('handleSubmit', mockHandleSubmit);
      expect(props).toHaveProperty('navigate', mockNavigate);
      expect(props).toHaveProperty('errors');
      expect(typeof props.onSubmit).toBe('function');
    });

    it('should pass empty errors object initially', () => {
      render(<LoginController />);

      const props = mockLoginView.mock.calls[0][0];
      expect(props.errors).toEqual({});
    });

    it('should pass form errors when they exist', () => {
      const mockErrors = {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' },
      };

      (useForm as Mock).mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: { errors: mockErrors },
      });

      render(<LoginController />);

      const props = mockLoginView.mock.calls[0][0];
      expect(props.errors).toEqual(mockErrors);
    });
  });

  describe('Successful login flow', () => {
    it('should handle successful login', async () => {
      const mockToken = 'jwt-token-xyz';
      mockAuthUser.mockResolvedValueOnce(mockToken);

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      const loginData: LoginData = {
        email: 'user@example.com',
        password: 'password123',
      };

      await act(async () => {
        await onSubmit(loginData);
      });

      expect(mockAuthUser).toHaveBeenCalledWith({
        userid: 'user@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockToastSuccess).toHaveBeenCalledWith('Login successfully!');
      expect(mockNavigate).toHaveBeenCalledWith(RoutesUrls.DASHBOARD);
    });

    it('should handle login with different email formats', async () => {
      const mockToken = 'token123';
      mockAuthUser.mockResolvedValueOnce(mockToken);

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      const loginData: LoginData = {
        email: 'test.email+tag@example.co.uk',
        password: 'securePassword123!',
      };

      await act(async () => {
        await onSubmit(loginData);
      });

      expect(mockAuthUser).toHaveBeenCalledWith({
        userid: 'test.email+tag@example.co.uk',
        password: 'securePassword123!',
      });
    });
  });

  describe('Loading state management', () => {
    it('should set isLoading to true during request and false after success', async () => {
      let resolveApi: (value: string) => void;
      const apiPromise = new Promise<string>(resolve => {
        resolveApi = resolve;
      });
      mockAuthUser.mockReturnValue(apiPromise);

      render(<LoginController />);

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      const loginData: LoginData = { email: 'test@test.com', password: 'pass' };

      const submitPromise = onSubmit(loginData);

      await waitFor(() => {
        const currentProps = mockLoginView.mock.lastCall?.[0];
        expect(currentProps.isLoading).toBe(true);
      });

      resolveApi!('token');
      await submitPromise;

      await waitFor(() => {
        const finalProps = mockLoginView.mock.lastCall?.[0];
        expect(finalProps.isLoading).toBe(false);
      });
    });

    it('should set isLoading to false after error', async () => {
      const error = new Error('Network error');
      mockAuthUser.mockRejectedValueOnce(error);

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({ email: 'test@test.com', password: 'pass' });
      });

      const finalProps = mockLoginView.mock.lastCall?.[0];
      expect(finalProps.isLoading).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle 422 validation error', async () => {
      const errorResponse = {
        response: {
          status: 422,
          data: { detail: 'Invalid email format' },
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockAuthUser.mockRejectedValueOnce(errorResponse);

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({ email: 'invalid', password: 'pass' } as LoginData);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Validation error from API:',
        'Invalid email format'
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Validation error. Check the data.'
      );
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle 422 error without detail', async () => {
      const errorResponse = {
        response: {
          status: 422,
          data: {},
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockAuthUser.mockRejectedValueOnce(errorResponse);

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({
          email: 'test@test.com',
          password: 'pass',
        } as LoginData);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Validation error from API:',
        undefined
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Validation error. Check the data.'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle generic axios error', async () => {
      const networkError = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockAuthUser.mockRejectedValueOnce(networkError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({
          email: 'test@test.com',
          password: 'pass',
        } as LoginData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unexpected error:',
        networkError
      );
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials.');

      consoleErrorSpy.mockRestore();
    });

    it('should handle non-axios errors', async () => {
      const genericError = new Error('Connection timeout');
      (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
      mockAuthUser.mockRejectedValueOnce(genericError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({
          email: 'test@test.com',
          password: 'pass',
        } as LoginData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unexpected error:',
        genericError
      );
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials.');
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle null error', async () => {
      (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
      mockAuthUser.mockRejectedValueOnce(null);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      await act(async () => {
        await onSubmit({
          email: 'test@test.com',
          password: 'pass',
        } as LoginData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error:', null);
      expect(mockToastError).toHaveBeenCalledWith('Invalid credentials.');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Data transformation', () => {
    it('should transform email to userid in payload', async () => {
      const mockToken = 'token';
      mockAuthUser.mockResolvedValueOnce(mockToken);

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      const loginData: LoginData = {
        email: 'user@domain.com',
        password: 'mypassword',
      };

      await act(async () => {
        await onSubmit(loginData);
      });

      expect(mockAuthUser).toHaveBeenCalledWith({
        userid: 'user@domain.com',
        password: 'mypassword',
      });
    });

    it('should preserve password as-is in payload', async () => {
      const mockToken = 'token';
      mockAuthUser.mockResolvedValueOnce(mockToken);

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];
      const loginData: LoginData = {
        email: 'test@test.com',
        password: 'P@ssw0rd123!@#',
      };

      await act(async () => {
        await onSubmit(loginData);
      });

      expect(mockAuthUser).toHaveBeenCalledWith({
        userid: 'test@test.com',
        password: 'P@ssw0rd123!@#',
      });
    });
  });

  describe('Multiple submissions', () => {
    it('should handle multiple successful submissions', async () => {
      const mockToken1 = 'token1';
      const mockToken2 = 'token2';

      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];

      mockAuthUser.mockResolvedValueOnce(mockToken1);
      await act(async () => {
        await onSubmit({ email: 'user1@test.com', password: 'pass1' });
      });

      expect(mockLogin).toHaveBeenCalledWith(mockToken1);
      expect(mockToastSuccess).toHaveBeenCalledTimes(1);

      mockAuthUser.mockResolvedValueOnce(mockToken2);
      await act(async () => {
        await onSubmit({ email: 'user2@test.com', password: 'pass2' });
      });

      expect(mockLogin).toHaveBeenCalledWith(mockToken2);
      expect(mockToastSuccess).toHaveBeenCalledTimes(2);
    });

    it('should handle submission after previous error', async () => {
      act(() => {
        render(<LoginController />);
      });

      const { onSubmit } = mockLoginView.mock.calls[0][0];

      mockAuthUser.mockRejectedValueOnce(new Error('Network error'));
      await act(async () => {
        await onSubmit({ email: 'user@test.com', password: 'wrongpass' });
      });

      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledTimes(1);

      const mockToken = 'success-token';
      mockAuthUser.mockResolvedValueOnce(mockToken);
      await act(async () => {
        await onSubmit({ email: 'user@test.com', password: 'correctpass' });
      });

      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockToastSuccess).toHaveBeenCalledTimes(1);
    });
  });
});

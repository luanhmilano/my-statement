import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { authUser } from '@/services/auth.api';
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

vi.mock('@/pages/login/view/login.view', () => ({
  default: vi.fn(() => <div data-testid="login-view">Mock Login View</div>),
}));

describe('LoginController', () => {
  const mockNavigate = useNavigate as Mock;
  const mockUseAuth = useAuth as Mock;
  const mockUseForm = useForm as Mock;
  const mockAuthUser = authUser as Mock;
  const mockLoginView = LoginView as Mock;
  const mockIsAxiosError = axios.isAxiosError as unknown as Mock;

  const loginFn = vi.fn();
  const navigateFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      login: loginFn,
    });

    mockNavigate.mockReturnValue(navigateFn);

    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
    });

    mockIsAxiosError.mockReturnValue(false);
  });

  it('should render LoginView and pass necessary props', () => {
    render(<LoginController />);

    expect(mockLoginView).toHaveBeenCalledTimes(1);

    const props = mockLoginView.mock.calls[0][0];

    expect(props).toHaveProperty('onSubmit');
    expect(props).toHaveProperty('isLoading', false);
    expect(props).toHaveProperty('register');
    expect(props).toHaveProperty('errors');
  });

  it('should handle successful login flow', async () => {
    const mockToken = 'jwt-token-xyz';
    mockAuthUser.mockResolvedValueOnce(mockToken);

    render(<LoginController />);

    const { onSubmit } = mockLoginView.mock.calls[0][0];

    const loginData: LoginData = {
      email: 'user@example.com',
      password: 'password123',
    };

    await onSubmit(loginData);

    expect(mockAuthUser).toHaveBeenCalledWith({
      userid: 'user@example.com',
      password: 'password123',
    });

    expect(loginFn).toHaveBeenCalledWith(mockToken);

    expect(toast.success).toHaveBeenCalledWith('Login successfully!');
    expect(navigateFn).toHaveBeenCalledWith(RoutesUrls.DASHBOARD);
  });

  it('should set isLoading correctly during and after request', async () => {
    let resolveApi: (value: unknown) => void;
    const apiPromise = new Promise(resolve => {
      resolveApi = resolve;
    });
    mockAuthUser.mockReturnValue(apiPromise);

    render(<LoginController />);

    const { onSubmit } = mockLoginView.mock.calls[0][0];
    const loginData = { email: 'a', password: 'b' } as LoginData;

    const submitPromise = onSubmit(loginData);

    await waitFor(() => {
      const currentProps = mockLoginView.mock.lastCall?.[0];
      expect(currentProps.isLoading).toBe(true);
    });

    // @ts-expect-error ignorando tipagem estrita aqui para simplicidade
    resolveApi('token');
    await submitPromise;

    await waitFor(() => {
      const finalProps = mockLoginView.mock.lastCall?.[0];
      expect(finalProps.isLoading).toBe(false);
    });
  });

  it('should handle validation error (422)', async () => {
    const errorResponse = {
      response: {
        status: 422,
        data: { detail: 'Invalid format' },
      },
    };

    mockAuthUser.mockRejectedValueOnce(errorResponse);
    mockIsAxiosError.mockReturnValue(true);

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(<LoginController />);

    const { onSubmit } = mockLoginView.mock.calls[0][0];
    await onSubmit({} as LoginData);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Validation error from API:',
      'Invalid format'
    );
    expect(toast.error).toHaveBeenCalledWith(
      'Validation error. Check the data.'
    );

    expect(loginFn).not.toHaveBeenCalled();
    expect(navigateFn).not.toHaveBeenCalled();
  });

  it('should handle unexpected/generic error', async () => {
    const genericError = new Error('Server Down');

    mockAuthUser.mockRejectedValueOnce(genericError);
    mockIsAxiosError.mockReturnValue(false);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<LoginController />);

    const { onSubmit } = mockLoginView.mock.calls[0][0];
    await onSubmit({} as LoginData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unexpected error:',
      genericError
    );
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials.');
  });
});

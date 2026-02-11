import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { createUser } from '@/services/auth.api';
import { RoutesUrls } from '@/utils/enums/routes-url';
import RegisterView from '@/pages/register/view/register.view';
import RegisterController from '@/pages/register/index.page';
import type { RegisterData } from '@/pages/register/utils/register-schema';

vi.mock('react-router-dom');
vi.mock('react-hook-form');
vi.mock('react-toastify');
vi.mock('axios');
vi.mock('@/services/api');

vi.mock('@/pages/register/view/register.view', () => ({
  default: vi.fn(() => <div data-testid="register-view">Mock View</div>),
}));

describe('RegisterController', () => {
  const mockNavigate = useNavigate as Mock;
  const mockUseForm = useForm as Mock;
  const mockCreateUser = createUser as Mock;
  const mockRegisterView = RegisterView as Mock;
  const mockIsAxiosError = axios.isAxiosError as unknown as Mock;

  const navigateFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate.mockReturnValue(navigateFn);
    mockUseForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
    });

    mockIsAxiosError.mockReturnValue(false);
  });

  it('should render RegisterView and pass necessary props', () => {
    render(<RegisterController />);

    expect(mockRegisterView).toHaveBeenCalledTimes(1);

    const props = mockRegisterView.mock.calls[0][0];

    expect(props).toHaveProperty('register');
    expect(props).toHaveProperty('handleSubmit');
    expect(props).toHaveProperty('onSubmit');
    expect(props).toHaveProperty('isLoading', false);
    expect(props).toHaveProperty('errors');
  });

  it('should handle successful user registration', async () => {
    mockCreateUser.mockResolvedValueOnce({});

    render(<RegisterController />);

    const { onSubmit } = mockRegisterView.mock.calls[0][0];

    const formData: RegisterData = {
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      birthdate: '1990-01-01',
    };

    await onSubmit(formData);

    expect(mockCreateUser).toHaveBeenCalledWith({
      userid: 'john@example.com',
      password: 'password123',
      fullname: 'John Doe',
      birthdate: '1990-01-01',
    });

    expect(toast.success).toHaveBeenCalledWith('User Created!');
    expect(navigateFn).toHaveBeenCalledWith(RoutesUrls.BASE_URL);
  });

  it('should set isLoading to true during submission and false after', async () => {
    let resolveApi: (value: unknown) => void;
    const apiPromise = new Promise(resolve => {
      resolveApi = resolve;
    });
    mockCreateUser.mockReturnValue(apiPromise);

    render(<RegisterController />);

    const { onSubmit } = mockRegisterView.mock.calls[0][0];
    const formData = {
      email: 'test@test.com',
      password: '123',
      firstName: 'a',
      lastName: 'b',
      confirmPassword: '123',
      birthdate: '2000-01-01',
    } as RegisterData;

    const submitPromise = onSubmit(formData);

    await waitFor(() => {
      const lastCallProps = mockRegisterView.mock.lastCall?.[0];
      expect(lastCallProps.isLoading).toBe(true);
    });

    // Resolve a API
    // @ts-expect-error Ignore
    resolveApi({});
    await submitPromise;

    await waitFor(() => {
      const finalProps = mockRegisterView.mock.lastCall?.[0];
      expect(finalProps.isLoading).toBe(false);
    });
  });

  it('should handle API validation error (422)', async () => {
    const errorResponse = {
      response: {
        status: 422,
        data: { detail: 'Email already exists' },
      },
    };

    mockCreateUser.mockRejectedValueOnce(errorResponse);
    mockIsAxiosError.mockReturnValue(true);

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(<RegisterController />);

    const { onSubmit } = mockRegisterView.mock.calls[0][0];
    await onSubmit({} as RegisterData);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Validation error from API:',
      'Email already exists'
    );
    expect(toast.error).toHaveBeenCalledWith(
      'Validation error. Please check your data.'
    );
    expect(navigateFn).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors (generic)', async () => {
    const genericError = new Error('Network Error');
    mockCreateUser.mockRejectedValueOnce(genericError);
    mockIsAxiosError.mockReturnValue(false);

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<RegisterController />);

    const { onSubmit } = mockRegisterView.mock.calls[0][0];
    await onSubmit({} as RegisterData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Unexpected error:',
      genericError
    );
    expect(toast.error).toHaveBeenCalledWith('Oops! Something went wrong.');
  });
});

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RoutesUrls } from '@/utils/enums/routes-url';
import RegisterView from '@/pages/register/view/register.view';
import RegisterController from '@/pages/register/index.page';
import type { RegisterData } from '@/pages/register/utils/register-schema';

vi.mock('react-router-dom');
vi.mock('react-hook-form');
vi.mock('react-toastify');
vi.mock('axios');
vi.mock('@hookform/resolvers/zod');

vi.mock('@/services/auth.api', () => ({
  createUser: vi.fn(),
}));

vi.mock('@/pages/register/view/register.view', () => ({
  default: vi.fn(() => <div data-testid="register-view">Mock View</div>),
}));

describe('RegisterController', () => {
  const mockNavigate = vi.fn();
  const mockRegister = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockCreateUser = vi.fn();
  const mockRegisterView = RegisterView as Mock;
  const mockToastSuccess = vi.fn();
  const mockToastError = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    (useForm as Mock).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
    });

    (toast.success as Mock).mockImplementation(mockToastSuccess);
    (toast.error as Mock).mockImplementation(mockToastError);

    (axios.isAxiosError as unknown as Mock).mockReturnValue(false);

    const { createUser } = await import('@/services/auth.api');
    (createUser as Mock).mockImplementation(mockCreateUser);
  });

  describe('Component rendering', () => {
    it('should render RegisterView with correct props', () => {
      act(() => {
        render(<RegisterController />);
      });

      expect(mockRegisterView).toHaveBeenCalledTimes(1);
      const props = mockRegisterView.mock.calls[0][0];

      expect(props).toHaveProperty('register', mockRegister);
      expect(props).toHaveProperty('handleSubmit', mockHandleSubmit);
      expect(props).toHaveProperty('onSubmit');
      expect(props).toHaveProperty('isLoading', false);
      expect(props).toHaveProperty('errors');
      expect(typeof props.onSubmit).toBe('function');
    });

    it('should pass empty errors object initially', () => {
      act(() => {
        render(<RegisterController />);
      });

      const props = mockRegisterView.mock.calls[0][0];
      expect(props.errors).toEqual({});
    });

    it('should pass form errors when they exist', () => {
      const mockErrors = {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' },
        firstName: { message: 'First name is required' },
      };

      (useForm as Mock).mockReturnValue({
        register: mockRegister,
        handleSubmit: mockHandleSubmit,
        formState: { errors: mockErrors },
      });

      act(() => {
        render(<RegisterController />);
      });

      const props = mockRegisterView.mock.calls[0][0];
      expect(props.errors).toEqual(mockErrors);
    });
  });

  describe('Successful registration flow', () => {
    it('should handle successful user registration', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'john@example.com',
        password: 'password123',
        fullname: 'John Doe',
        birthdate: '1990-01-01',
      });
      expect(mockToastSuccess).toHaveBeenCalledWith('User Created!');
      expect(mockNavigate).toHaveBeenCalledWith(RoutesUrls.BASE_URL);
    });

    it('should handle registration with different name formats', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'mary.jane@example.com',
        password: 'securePass123!',
        confirmPassword: 'securePass123!',
        firstName: 'Mary Jane',
        lastName: 'Watson-Smith',
        birthdate: '1995-05-15',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'mary.jane@example.com',
        password: 'securePass123!',
        fullname: 'Mary Jane Watson-Smith',
        birthdate: '1995-05-15',
      });
    });

    it('should handle registration with single character names', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'a@b.com',
        password: 'pass123',
        confirmPassword: 'pass123',
        firstName: 'A',
        lastName: 'B',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'a@b.com',
        password: 'pass123',
        fullname: 'A B',
        birthdate: '2000-01-01',
      });
    });
  });

  describe('Loading state management', () => {
    it('should set isLoading to true during submission and false after success', async () => {
      let resolveApi: (value: unknown) => void;
      const apiPromise = new Promise(resolve => {
        resolveApi = resolve;
      });
      mockCreateUser.mockReturnValue(apiPromise);

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: '123',
        confirmPassword: '123',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      const submitPromise = act(() => {
        onSubmit(formData);
      });

      await waitFor(() => {
        const currentProps = mockRegisterView.mock.lastCall?.[0];
        expect(currentProps.isLoading).toBe(true);
      });

      resolveApi!({});
      await act(async () => {
        await submitPromise;
      });

      await waitFor(() => {
        const finalProps = mockRegisterView.mock.lastCall?.[0];
        expect(finalProps.isLoading).toBe(false);
      });
    });

    it('should set isLoading to false after error', async () => {
      const error = new Error('Network error');
      mockCreateUser.mockRejectedValueOnce(error);

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      const finalProps = mockRegisterView.mock.lastCall?.[0];
      expect(finalProps.isLoading).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle 422 validation error with detail', async () => {
      const errorResponse = {
        response: {
          status: 422,
          data: { detail: 'Email already exists' },
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockCreateUser.mockRejectedValueOnce(errorResponse);

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Validation error from API:',
        'Email already exists'
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Validation error. Please check your data.'
      );
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle 422 validation error without detail', async () => {
      const errorResponse = {
        response: {
          status: 422,
          data: {},
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockCreateUser.mockRejectedValueOnce(errorResponse);

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Validation error from API:',
        undefined
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Validation error. Please check your data.'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle generic axios error', async () => {
      const networkError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
      mockCreateUser.mockRejectedValueOnce(networkError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unexpected error:',
        networkError
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Oops! Something went wrong.'
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle non-axios errors', async () => {
      const genericError = new Error('Network Error');
      (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
      mockCreateUser.mockRejectedValueOnce(genericError);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unexpected error:',
        genericError
      );
      expect(mockToastError).toHaveBeenCalledWith(
        'Oops! Something went wrong.'
      );
      expect(mockNavigate).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle null error', async () => {
      (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
      mockCreateUser.mockRejectedValueOnce(null);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2000-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error:', null);
      expect(mockToastError).toHaveBeenCalledWith(
        'Oops! Something went wrong.'
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Data transformation', () => {
    it('should transform email to userid in payload', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'user@domain.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '1990-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'user@domain.com', // email transformed to userid
        password: 'password123',
        fullname: 'John Doe',
        birthdate: '1990-01-01',
      });
    });

    it('should combine firstName and lastName into fullname', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Jane',
        lastName: 'Smith',
        birthdate: '1985-12-25',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'test@test.com',
        password: 'pass',
        fullname: 'Jane Smith',
        birthdate: '1985-12-25',
      });
    });

    it('should preserve exact birthdate format', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '2001-06-15',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'test@test.com',
        password: 'pass',
        fullname: 'Test User',
        birthdate: '2001-06-15', // exact format preserved
      });
    });

    it('should not include confirmPassword in payload', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
        birthdate: '1990-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      const payload = mockCreateUser.mock.calls[0][0];
      expect(payload).not.toHaveProperty('confirmPassword');
      expect(Object.keys(payload)).toEqual([
        'userid',
        'password',
        'fullname',
        'birthdate',
      ]);
    });
  });

  describe('Multiple submissions', () => {
    it('should handle multiple successful submissions', async () => {
      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];

      mockCreateUser.mockResolvedValueOnce({});
      await act(async () => {
        await onSubmit({
          email: 'user1@test.com',
          password: 'pass1',
          confirmPassword: 'pass1',
          firstName: 'User',
          lastName: 'One',
          birthdate: '1990-01-01',
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);

      mockCreateUser.mockResolvedValueOnce({});
      await act(async () => {
        await onSubmit({
          email: 'user2@test.com',
          password: 'pass2',
          confirmPassword: 'pass2',
          firstName: 'User',
          lastName: 'Two',
          birthdate: '1991-01-01',
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it('should handle submission after previous error', async () => {
      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];

      mockCreateUser.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await onSubmit({
          email: 'fail@test.com',
          password: 'pass',
          confirmPassword: 'pass',
          firstName: 'Fail',
          lastName: 'User',
          birthdate: '1990-01-01',
        });
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledTimes(1);

      mockCreateUser.mockResolvedValueOnce({});
      await act(async () => {
        await onSubmit({
          email: 'success@test.com',
          password: 'correctpass',
          confirmPassword: 'correctpass',
          firstName: 'Success',
          lastName: 'User',
          birthdate: '1991-01-01',
        });
      });

      expect(mockToastSuccess).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(RoutesUrls.BASE_URL);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty form data gracefully', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthdate: '',
      } as RegisterData;

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: '',
        password: '',
        fullname: ' ',
        birthdate: '',
      });
    });

    it('should handle special characters in names', async () => {
      mockCreateUser.mockResolvedValueOnce({});

      act(() => {
        render(<RegisterController />);
      });

      const { onSubmit } = mockRegisterView.mock.calls[0][0];
      const formData: RegisterData = {
        email: 'test@test.com',
        password: 'pass',
        confirmPassword: 'pass',
        firstName: "O'Connor",
        lastName: 'Van-Der-Berg',
        birthdate: '1990-01-01',
      };

      await act(async () => {
        await onSubmit(formData);
      });

      expect(mockCreateUser).toHaveBeenCalledWith({
        userid: 'test@test.com',
        password: 'pass',
        fullname: "O'Connor Van-Der-Berg",
        birthdate: '1990-01-01',
      });
    });
  });
});

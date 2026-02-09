import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RegisterForm from '@/pages/register/components/register-form';

// Mock dependencies
vi.mock('@/components/spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('RegisterForm Component', () => {
  const mockProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
    register: vi.fn(name => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: vi.fn(callback => async (e: any) => {
      e.preventDefault();
      await callback();
    }),
    errors: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => render(<RegisterForm {...mockProps} />)).not.toThrow();
  });

  it('should render all form elements correctly', () => {
    render(<RegisterForm {...mockProps} />);

    expect(
      screen.getByRole('heading', { name: 'Create account' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please fill in the fields below to create an account.')
    ).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Birth Date')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your last name')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your first name')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your e-mail')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm your password')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument();
  });

  it('should call handleSubmit and onSubmit when form is submitted', async () => {
    const { container } = render(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(mockProps.handleSubmit).toHaveBeenCalledWith(mockProps.onSubmit);
  });

  it('should display spinner when loading', () => {
    render(<RegisterForm {...mockProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Create Account' })
    ).not.toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    render(<RegisterForm {...mockProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display lastName error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: {
        lastName: { message: 'Last name is required', type: 'required' },
      },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });

  it('should display firstName error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: {
        firstName: { message: 'First name is required', type: 'required' },
      },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });

  it('should display email error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: { email: { message: 'Email is required', type: 'required' } },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should display birthdate error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: {
        birthdate: { message: 'Birth date is required', type: 'required' },
      },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('Birth date is required')).toBeInTheDocument();
  });

  it('should display password error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: {
        password: { message: 'Password is required', type: 'required' },
      },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should display confirmPassword error when present', () => {
    const propsWithError = {
      ...mockProps,
      errors: {
        confirmPassword: {
          message: 'Passwords do not match',
          type: 'validate',
        },
      },
    };

    render(<RegisterForm {...propsWithError} />);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should display multiple errors simultaneously', () => {
    const propsWithMultipleErrors = {
      ...mockProps,
      errors: {
        lastName: { message: 'Last name is required', type: 'required' },
        email: { message: 'Invalid email format', type: 'pattern' },
        password: {
          message: 'Password must be at least 8 characters',
          type: 'minLength',
        },
      },
    };

    render(<RegisterForm {...propsWithMultipleErrors} />);

    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(
      screen.getByText('Password must be at least 8 characters')
    ).toBeInTheDocument();
  });

  it('should register all form inputs', () => {
    render(<RegisterForm {...mockProps} />);

    expect(mockProps.register).toHaveBeenCalledWith('lastName');
    expect(mockProps.register).toHaveBeenCalledWith('firstName');
    expect(mockProps.register).toHaveBeenCalledWith('email');
    expect(mockProps.register).toHaveBeenCalledWith('birthdate');
    expect(mockProps.register).toHaveBeenCalledWith('password');
    expect(mockProps.register).toHaveBeenCalledWith('confirmPassword');
  });

  it('should have noValidate attribute on form', () => {
    const { container } = render(<RegisterForm {...mockProps} />);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('noValidate');
  });

  it('should render ToastContainer', () => {
    render(<RegisterForm {...mockProps} />);

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('should have correct input types', () => {
    render(<RegisterForm {...mockProps} />);

    const lastNameInput = screen.getByPlaceholderText('Enter your last name');
    const firstNameInput = screen.getByPlaceholderText('Enter your first name');
    const emailInput = screen.getByPlaceholderText('Enter your e-mail');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    );

    expect(lastNameInput).toHaveAttribute('type', 'text');
    expect(firstNameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should have proper form structure with rows and columns', () => {
    const { container } = render(<RegisterForm {...mockProps} />);

    const rows = container.querySelectorAll('[class*="row"]');
    expect(rows).toHaveLength(2);

    const fieldColumns = container.querySelectorAll('[class*="fieldColumn"]');
    expect(fieldColumns).toHaveLength(4);

    const regularFields = container.querySelectorAll(
      '[class*="field"]:not([class*="fieldColumn"])'
    );
    expect(regularFields).toHaveLength(2);
  });

  it('should not display errors when errors object is empty', () => {
    render(<RegisterForm {...mockProps} errors={{}} />);

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('should call register with correct field names in proper order', () => {
    render(<RegisterForm {...mockProps} />);

    const calls = mockProps.register.mock.calls.map(call => call[0]);
    expect(calls).toEqual([
      'lastName',
      'firstName',
      'email',
      'birthdate',
      'password',
      'confirmPassword',
    ]);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { RoutesUrls } from '@/utils/enums/routes-url';
import LoginForm from '@/pages/login/components/login-form';

// Mock dependencies
vi.mock('@/components/spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));

vi.mock('@/utils/enums/routes-url', () => ({
  RoutesUrls: {
    REGISTER: '/register',
  },
}));

describe('LoginForm Component', () => {
  const mockProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
    register: vi.fn((name) => ({ name, onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: vi.fn((callback) => async (e: any) => {
      e.preventDefault();
      await callback();
    }),
    errors: {},
    navigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without errors', () => {
    expect(() => render(<LoginForm {...mockProps} />)).not.toThrow();
  });

  it('should render all form elements correctly', () => {
    render(<LoginForm {...mockProps} />);

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByText('Welcome to My Statement, please fill in the fields below to log into your account.')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('should call handleSubmit and onSubmit when form is submitted', async () => {
    const { container } = render(<LoginForm {...mockProps} />);
    
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(mockProps.handleSubmit).toHaveBeenCalledWith(mockProps.onSubmit);
  });

  it('should display spinner when loading', () => {
    render(<LoginForm {...mockProps} isLoading={true} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Log in' })).not.toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    render(<LoginForm {...mockProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
  });

  it('should display email error when present', () => {
    const propsWithEmailError = {
      ...mockProps,
      errors: { email: { message: 'Email is required', type: 'required' } },
    };

    render(<LoginForm {...propsWithEmailError} />);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should display password error when present', () => {
    const propsWithPasswordError = {
      ...mockProps,
      errors: { password: { message: 'Password is required', type: 'required' } },
    };

    render(<LoginForm {...propsWithPasswordError} />);

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should call navigate with register route when create account button is clicked', () => {
    render(<LoginForm {...mockProps} />);

    const createAccountButton = screen.getByRole('button', { name: 'Create account' });
    fireEvent.click(createAccountButton);

    expect(mockProps.navigate).toHaveBeenCalledWith(RoutesUrls.REGISTER);
  });

  it('should register email and password inputs', () => {
    render(<LoginForm {...mockProps} />);

    expect(mockProps.register).toHaveBeenCalledWith('email');
    expect(mockProps.register).toHaveBeenCalledWith('password');
  });

  it('should have noValidate attribute on form', () => {
    const { container } = render(<LoginForm {...mockProps} />);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('noValidate');
  });

  it('should render ToastContainer', () => {
    render(<LoginForm {...mockProps} />);

    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('should have correct input types', () => {
    render(<LoginForm {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('E-mail');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
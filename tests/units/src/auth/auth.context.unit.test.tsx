import { render } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext } from '@/auth/auth.context';

describe('AuthContext', () => {
  it('should have undefined as default value', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(AuthContext);
      return null;
    };

    render(<TestComponent />);

    expect(contextValue).toBeUndefined();
  });

  it('should provide context value when wrapped in provider', () => {
    const mockContextValue = {
      isAuthenticated: true,
      login: () => {},
      logout: () => {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let contextValue: any;

    const TestComponent = () => {
      contextValue = useContext(AuthContext);
      return null;
    };

    render(
      <AuthContext.Provider value={mockContextValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(contextValue).toEqual(mockContextValue);
  });

  it('should be created without throwing errors', () => {
    expect(() => {
      const context = AuthContext;
      expect(context).toBeDefined();
    }).not.toThrow();
  });
});

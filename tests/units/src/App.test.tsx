import App from "@/App";
import { render, screen } from "@testing-library/react";

// Mock o hook useAuth
vi.mock("@/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the RouterProvider
vi.mock("@/routes", () => ({
  RouterProvider: () => <div data-testid="router-provider">Router Content</div>,
}));

// Mock the AuthProvider
vi.mock("@/auth/auth.provider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

describe("App Component", () => {
  it("should render AuthProvider wrapping RouterProvider", () => {
    render(<App />);

    const authProvider = screen.getByTestId("auth-provider");
    const routerProvider = screen.getByTestId("router-provider");

    expect(authProvider).toBeInTheDocument();
    expect(routerProvider).toBeInTheDocument();
    expect(authProvider).toContainElement(routerProvider);
  });

  it("should have correct component hierarchy", () => {
    const { container } = render(<App />);

    const authProvider = screen.getByTestId("auth-provider");
    const routerProvider = screen.getByTestId("router-provider");

    expect(container.firstChild).toBe(authProvider);
    expect(authProvider.firstChild).toBe(routerProvider);
  });

  it("should render RouterProvider content", () => {
    render(<App />);

    expect(screen.getByText("Router Content")).toBeInTheDocument();
  });

  it("should render without errors", () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
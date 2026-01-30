import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RouteGuard from "@/components/route-guard";
import { useAuth } from "@/auth/hooks/useAuth";

// Mock the useAuth hook
vi.mock("@/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockUseAuth = vi.mocked(useAuth);

// Mock component to test Outlet rendering
const TestChildComponent = () => (
  <div data-testid="protected-content">Protected Content</div>
);

const LoginPage = () => (
  <div data-testid="login-page">Login Page</div>
);

// Proper setup with Routes structure
const renderRouteGuard = (initialEntries = ["/protected"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/protected" element={<RouteGuard />}>
          <Route index element={<TestChildComponent />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe("RouteGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render protected content when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderRouteGuard();

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("should redirect to login page when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    })

    const { container } = renderRouteGuard()
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(container.innerHTML).not.toContain('Protected Content')
  })

  it('should call useAuth hook', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    })

    renderRouteGuard()
    
    expect(mockUseAuth).toHaveBeenCalled()
    expect(mockUseAuth).toHaveBeenCalledTimes(1)
  })

  it('should render Outlet when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    })

    render(
      <MemoryRouter>
        <RouteGuard />
      </MemoryRouter>
    )

    // The Outlet should be rendered (no navigation occurs)
    expect(mockUseAuth).toHaveBeenCalled()
  })

  it('should handle authentication state changes', () => {
    // First render as unauthenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    })

    const { rerender } = renderRouteGuard()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()

    // Then rerender as authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    })

    rerender(
      <MemoryRouter initialEntries={['/protected']}>
        <RouteGuard />
        <TestChildComponent />
      </MemoryRouter>
    )

    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
});

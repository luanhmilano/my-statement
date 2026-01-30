import { render, screen, act } from "@testing-library/react";
import { AuthProvider } from "@/auth/auth.provider";
import { useAuth } from "@/auth/hooks/useAuth";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "not authenticated"}
      </span>
      <button data-testid="login-btn" onClick={() => login("test-token")}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it("should initialize with no token when localStorage is empty", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not authenticated",
    );
    expect(localStorageMock.getItem).toHaveBeenCalledWith("authToken");
  });

  it("should initialize with token when localStorage has authToken", () => {
    localStorageMock.getItem.mockReturnValue("existing-token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated",
    );
    expect(localStorageMock.getItem).toHaveBeenCalledWith("authToken");
  });

  it("should login user and store token in localStorage", async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not authenticated",
    );

    await act(async () => {
      screen.getByTestId("login-btn").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "authToken",
      "test-token",
    );
  });

  it("should logout user and remove token from localStorage", async () => {
    localStorageMock.getItem.mockReturnValue("existing-token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated",
    );

    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not authenticated",
    );
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("authToken");
  });

  it("should show authenticated when token exists in localStorage", () => {
    localStorageMock.getItem.mockReturnValue("some-token");
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated",
    );
  });

  it("should show not authenticated when no token exists in localStorage", () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not authenticated",
    );
  });

  it("should memoize context value correctly", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const TestMemoComponent = () => {
      const auth = useAuth();
      return (
        <div data-testid="memo-test">
          {JSON.stringify(auth.isAuthenticated)}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestMemoComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("memo-test")).toHaveTextContent("false");
  });
});

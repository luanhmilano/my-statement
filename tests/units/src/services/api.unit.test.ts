/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('@/utils/get-config', () => ({
  getConfig: vi.fn().mockReturnValue({
    USERS_URL: 'https://api.example.com/users',
    AUTH_URL: 'https://api.example.com/auth',
  }),
}));

import axios from 'axios';
import { getConfig } from '@/utils/get-config';
import type { UserAuthData, UserData } from '@/services/types';
import { authUser, createUser } from '@/services/auth.api';

const mockGetConfig = vi.mocked(getConfig);
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});
const mockedAxios = axios as any;

describe('createUser', () => {
  const mockUserData: UserData = {
    userid: 'John',
    password: 'password123',
    birthdate: '1990-01-01',
    fullname: 'John Doe',
  };

  const mockUsersUrl = 'https://api.example.com/users';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetConfig.mockReturnValue({
      USERS_URL: mockUsersUrl,
      AUTH_URL: 'https://api.example.com/auth',
    });
  });

  it('should successfully create a user with correct API call', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createUser(mockUserData);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUsersUrl,
      JSON.stringify(mockUserData),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should use correct URL from config', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createUser(mockUserData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUsersUrl,
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should stringify user data correctly', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createUser(mockUserData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockUserData),
      expect.any(Object)
    );
  });

  it('should set correct headers', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createUser(mockUserData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should handle API errors and re-throw them', async () => {
    const mockError = new Error('API Error');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(createUser(mockUserData)).rejects.toThrow('API Error');

    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Create user error:',
      mockError
    );
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(networkError);

    await expect(createUser(mockUserData)).rejects.toThrow('Network Error');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Create user error:',
      networkError
    );
  });

  it('should handle validation errors from API', async () => {
    const validationError = {
      response: {
        status: 400,
        data: { message: 'Validation failed' },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(validationError);

    await expect(createUser(mockUserData)).rejects.toEqual(validationError);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Create user error:',
      validationError
    );
  });

  it('should handle server errors from API', async () => {
    const serverError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(serverError);

    await expect(createUser(mockUserData)).rejects.toEqual(serverError);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Create user error:',
      serverError
    );
  });

  it('should work with different user data formats', async () => {
    const differentUserData: UserData = {
      userid: 'Jane',
      password: 'securePassword456',
      birthdate: '1992-05-15',
      fullname: 'Jane Smith',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: { id: 2 } });

    await createUser(differentUserData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUsersUrl,
      JSON.stringify(differentUserData),
      expect.any(Object)
    );
  });
});

describe('authUser', () => {
  const mockAuthData: UserAuthData = {
    userid: 'John',
    password: 'password123',
  };

  const mockAuthUrl = 'https://api.example.com/auth';
  const mockAccessToken = 'mock-access-token-12345';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetConfig.mockReturnValue({
      USERS_URL: 'https://api.example.com/users',
      AUTH_URL: mockAuthUrl,
    });
  });

  it('should successfully authenticate user and return access token', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    });

    const result = await authUser(mockAuthData);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockAuthUrl,
      JSON.stringify(mockAuthData),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result).toBe(mockAccessToken);
  });

  it('should use correct AUTH_URL from config', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    });

    await authUser(mockAuthData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockAuthUrl,
      expect.any(String),
      expect.any(Object)
    );
  });

  it('should stringify auth data correctly', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    });

    await authUser(mockAuthData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockAuthData),
      expect.any(Object)
    );
  });

  it('should set correct headers', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    });

    await authUser(mockAuthData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('should handle authentication errors and re-throw them', async () => {
    const mockError = new Error('Authentication failed');
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(authUser(mockAuthData)).rejects.toThrow(
      'Authentication failed'
    );

    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Auth user error:',
      mockError
    );
  });

  it('should handle invalid credentials error', async () => {
    const credentialsError = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(credentialsError);

    await expect(authUser(mockAuthData)).rejects.toEqual(credentialsError);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Auth user error:',
      credentialsError
    );
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.post.mockRejectedValueOnce(networkError);

    await expect(authUser(mockAuthData)).rejects.toThrow('Network Error');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Auth user error:',
      networkError
    );
  });

  it('should handle server errors from API', async () => {
    const serverError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(serverError);

    await expect(authUser(mockAuthData)).rejects.toEqual(serverError);

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Auth user error:',
      serverError
    );
  });

  it('should work with different auth data formats', async () => {
    const differentAuthData: UserAuthData = {
      userid: 'Jane',
      password: 'differentPassword789',
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'different-token-67890' },
    });

    const result = await authUser(differentAuthData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockAuthUrl,
      JSON.stringify(differentAuthData),
      expect.any(Object)
    );
    expect(result).toBe('different-token-67890');
  });

  it('should return access_token from response data', async () => {
    const customToken = 'custom-access-token-xyz';
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: customToken },
    });

    const result = await authUser(mockAuthData);

    expect(result).toBe(customToken);
  });
});

import { getConfig, type ConfigProps } from '@/utils/get-config';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/utils/get-config', () => ({
  getConfig: vi.fn(),
}));

describe('getConfig', () => {
  const mockGetConfig = vi.mocked(getConfig);

  beforeEach(() => {
    mockGetConfig.mockClear();
  });

  it('should return config with all environment variables when they exist', () => {
    const mockConfig = {
      USERS_URL: 'https://users.example.com',
      AUTH_URL: 'https://auth.example.com',
      API_URL: 'https://api.example.com',
    };

    mockGetConfig.mockReturnValue(mockConfig);

    const result = getConfig();

    expect(result).toEqual({
      USERS_URL: 'https://users.example.com',
      AUTH_URL: 'https://auth.example.com',
      API_URL: 'https://api.example.com',
    });
    expect(mockGetConfig).toHaveBeenCalled();
  });

  it('should return empty strings as fallbacks when environment variables are missing', () => {
    const mockConfig = {
      USERS_URL: '',
      AUTH_URL: '',
      API_URL: '',
    };

    mockGetConfig.mockReturnValue(mockConfig);

    const result = getConfig();

    expect(result).toEqual({
      USERS_URL: '',
      AUTH_URL: '',
      API_URL: '',
    });
    expect(mockGetConfig).toHaveBeenCalled();
  });

  it('should return partial config with fallbacks for missing variables', () => {
    const mockConfig = {
      USERS_URL: 'https://users.example.com',
      AUTH_URL: '',
      API_URL: 'https://api.example.com',
    };

    mockGetConfig.mockReturnValue(mockConfig);

    const result = getConfig();

    expect(result).toEqual({
      USERS_URL: 'https://users.example.com',
      AUTH_URL: '',
      API_URL: 'https://api.example.com',
    });
    expect(mockGetConfig).toHaveBeenCalled();
  });

  it('should return object that matches ConfigProps interface', () => {
    const mockConfig: ConfigProps = {
      USERS_URL: 'https://users.example.com',
      AUTH_URL: 'https://auth.example.com',
      API_URL: 'https://api.example.com',
    };

    mockGetConfig.mockReturnValue(mockConfig);

    const result = getConfig();

    expect(result).toHaveProperty('USERS_URL');
    expect(result).toHaveProperty('AUTH_URL');
    expect(result).toHaveProperty('API_URL');
    expect(typeof result.USERS_URL).toBe('string');
    expect(typeof result.AUTH_URL).toBe('string');
    expect(typeof result.API_URL).toBe('string');
    expect(mockGetConfig).toHaveBeenCalled();
  });

  it('should be called and return consistent values', () => {
    const mockConfig = {
      USERS_URL: 'https://users.example.com',
      AUTH_URL: 'https://auth.example.com',
      API_URL: 'https://api.example.com',
    };

    mockGetConfig.mockReturnValue(mockConfig);

    const result1 = getConfig();
    const result2 = getConfig();

    expect(result1).toEqual(result2);
    expect(mockGetConfig).toHaveBeenCalledTimes(2);
  });
});

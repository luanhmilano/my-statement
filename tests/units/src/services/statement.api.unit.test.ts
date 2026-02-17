/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getConfig } from '@/utils/get-config';
import { fetchBalance, fetchStatement } from '@/services/statement.api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processStatementData } from '@/pages/dashboard/utils/process-statement-data';
import type { StatementItem } from '@/pages/dashboard/types';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock('@/utils/get-config', () => ({
    getConfig: vi.fn().mockReturnValue({
        API_URL: 'https://api.example.com',
    }),
}));

vi.mock('@/pages/dashboard/utils/process-statement-data', () => ({
    processStatementData: vi.fn().mockReturnValue([]),
}));

const mockGetConfig = vi.mocked(getConfig);
const mockProcessStatementData = vi.mocked(processStatementData);
const mockConsoleError = vi
    .spyOn(console, 'error')
    .mockImplementation(() => { });
const mockedAxios = axios as any;

describe('fetchStatement', () => {
    const mockToken = 'mock-bearer-token-12345';
    const mockApiUrl = 'https://api.example.com';
    const mockRawData = [
        { id: 1, amount: 100, description: 'Payment 1' },
        { id: 2, amount: -50, description: 'Withdrawal 1' }
    ];
    const mockProcessedStatements: StatementItem[] = [
        { id: 1, amount: 100, description: 'Payment 1', type: 'Transfer', date: '2026-01-01', card: '1234' },
        { id: 2, amount: -50, description: 'Withdrawal 1', type: 'Withdrawal', date: '2026-01-02', card: '5678' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetConfig.mockReturnValue({
            API_URL: mockApiUrl,
            AUTH_URL: 'https://auth.example.com',
            USERS_URL: 'https://users.example.com',
        });
        mockProcessStatementData.mockReturnValue(mockProcessedStatements);
    });

    it('should successfully fetch statements with correct API call', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: mockRawData,
        });

        const result = await fetchStatement(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${mockApiUrl}/statements/?limit=50`,
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            }
        );
        expect(result).toBe(mockProcessedStatements);
    });

    it('should use correct URL from config with limit parameter', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: mockRawData,
        });

        await fetchStatement(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${mockApiUrl}/statements/?limit=50`,
            expect.any(Object)
        );
    });

    it('should set correct Authorization header with Bearer token', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: mockRawData,
        });

        await fetchStatement(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.any(String),
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            }
        );
    });

    it('should process statement data and return processed statements', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: mockRawData,
        });

        const result = await fetchStatement(mockToken);

        expect(mockProcessStatementData).toHaveBeenCalledTimes(1);
        expect(mockProcessStatementData).toHaveBeenCalledWith(mockRawData);
        expect(result).toBe(mockProcessedStatements);
    });

    it('should handle API errors and re-throw them', async () => {
        const mockError = new Error('API Error');
        mockedAxios.get.mockRejectedValueOnce(mockError);

        await expect(fetchStatement(mockToken)).rejects.toThrow('API Error');

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch statement error:',
            mockError
        );
    });

    it('should handle network errors', async () => {
        const networkError = new Error('Network Error');
        mockedAxios.get.mockRejectedValueOnce(networkError);

        await expect(fetchStatement(mockToken)).rejects.toThrow('Network Error');

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch statement error:',
            networkError
        );
    });

    it('should handle authorization errors from API', async () => {
        const authError = {
            response: {
                status: 401,
                data: { message: 'Unauthorized' },
            },
        };
        mockedAxios.get.mockRejectedValueOnce(authError);

        await expect(fetchStatement(mockToken)).rejects.toEqual(authError);

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch statement error:',
            authError
        );
    });

    it('should handle server errors from API', async () => {
        const serverError = {
            response: {
                status: 500,
                data: { message: 'Internal server error' },
            },
        };
        mockedAxios.get.mockRejectedValueOnce(serverError);

        await expect(fetchStatement(mockToken)).rejects.toEqual(serverError);

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch statement error:',
            serverError
        );
    });

    it('should work with different tokens', async () => {
        const differentToken = 'different-token-67890';
        mockedAxios.get.mockResolvedValueOnce({
            data: mockRawData,
        });

        await fetchStatement(differentToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.any(String),
            {
                headers: {
                    Authorization: `Bearer ${differentToken}`,
                },
            }
        );
    });

    it('should handle empty statement data correctly', async () => {
        const emptyData: any[] = [];
        const emptyProcessedData: any[] = [];
        mockedAxios.get.mockResolvedValueOnce({
            data: emptyData,
        });
        mockProcessStatementData.mockReturnValueOnce(emptyProcessedData);

        const result = await fetchStatement(mockToken);

        expect(mockProcessStatementData).toHaveBeenCalledWith(emptyData);
        expect(result).toBe(emptyProcessedData);
    });

    it('should handle large statement datasets', async () => {
        const largeDataset = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            amount: Math.random() * 1000,
            description: `Transaction ${i + 1}`
        }));
        mockedAxios.get.mockResolvedValueOnce({
            data: largeDataset,
        });

        await fetchStatement(mockToken);

        expect(mockProcessStatementData).toHaveBeenCalledWith(largeDataset);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.stringContaining('limit=50'),
            expect.any(Object)
        );
    });

    it('should not call processStatementData when API call fails', async () => {
        const mockError = new Error('API Error');
        mockedAxios.get.mockRejectedValueOnce(mockError);

        await expect(fetchStatement(mockToken)).rejects.toThrow();

        expect(mockProcessStatementData).not.toHaveBeenCalled();
    });
});

describe('fetchBalance', () => {
    const mockToken = 'mock-bearer-token-12345';
    const mockApiUrl = 'https://api.example.com';
    const mockBalance = 1500.75;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetConfig.mockReturnValue({
            API_URL: mockApiUrl,
            AUTH_URL: 'https://auth.example.com',
            USERS_URL: 'https://users.example.com',
        });
    });

    it('should successfully fetch balance with correct API call', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: mockBalance },
        });

        const result = await fetchBalance(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${mockApiUrl}/balance/`,
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            }
        );
        expect(result).toBe(mockBalance);
    });

    it('should use correct URL from config', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: mockBalance },
        });

        await fetchBalance(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${mockApiUrl}/balance/`,
            expect.any(Object)
        );
    });

    it('should set correct Authorization header with Bearer token', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: mockBalance },
        });

        await fetchBalance(mockToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.any(String),
            {
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
            }
        );
    });

    it('should return balance amount from response data', async () => {
        const customBalance = 2750.25;
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: customBalance },
        });

        const result = await fetchBalance(mockToken);

        expect(result).toBe(customBalance);
    });

    it('should handle API errors and re-throw them', async () => {
        const mockError = new Error('API Error');
        mockedAxios.get.mockRejectedValueOnce(mockError);

        await expect(fetchBalance(mockToken)).rejects.toThrow('API Error');

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch balance error:',
            mockError
        );
    });

    it('should handle network errors', async () => {
        const networkError = new Error('Network Error');
        mockedAxios.get.mockRejectedValueOnce(networkError);

        await expect(fetchBalance(mockToken)).rejects.toThrow('Network Error');

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch balance error:',
            networkError
        );
    });

    it('should handle authorization errors from API', async () => {
        const authError = {
            response: {
                status: 401,
                data: { message: 'Unauthorized' },
            },
        };
        mockedAxios.get.mockRejectedValueOnce(authError);

        await expect(fetchBalance(mockToken)).rejects.toEqual(authError);

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch balance error:',
            authError
        );
    });

    it('should handle server errors from API', async () => {
        const serverError = {
            response: {
                status: 500,
                data: { message: 'Internal server error' },
            },
        };
        mockedAxios.get.mockRejectedValueOnce(serverError);

        await expect(fetchBalance(mockToken)).rejects.toEqual(serverError);

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Fetch balance error:',
            serverError
        );
    });

    it('should work with different tokens', async () => {
        const differentToken = 'different-token-67890';
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: mockBalance },
        });

        await fetchBalance(differentToken);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.any(String),
            {
                headers: {
                    Authorization: `Bearer ${differentToken}`,
                },
            }
        );
    });

    it('should handle zero balance correctly', async () => {
        const zeroBalance = 0;
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: zeroBalance },
        });

        const result = await fetchBalance(mockToken);

        expect(result).toBe(zeroBalance);
    });

    it('should handle negative balance correctly', async () => {
        const negativeBalance = -250.50;
        mockedAxios.get.mockResolvedValueOnce({
            data: { amount: negativeBalance },
        });

        const result = await fetchBalance(mockToken);

        expect(result).toBe(negativeBalance);
    });
});
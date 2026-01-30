import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContext } from 'react'
import { useAuth } from '@/auth/hooks/useAuth'

// Mock useContext
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn()
  }
})

const mockUseContext = vi.mocked(useContext)

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return auth context when used within AuthProvider', () => {
    const mockAuthContext = {
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    }

    mockUseContext.mockReturnValue(mockAuthContext)

    const { result } = renderHook(() => useAuth())

    expect(result.current).toEqual(mockAuthContext)
    expect(mockUseContext).toHaveBeenCalledTimes(1)
  })

  it('should throw error when used outside AuthProvider', () => {
    mockUseContext.mockReturnValue(null)

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })

  it('should throw error when context is undefined', () => {
    mockUseContext.mockReturnValue(undefined)

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
  })

  it('should return different context values correctly', () => {
    const mockAuthContext1 = {
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    }

    mockUseContext.mockReturnValue(mockAuthContext1)

    const { result, rerender } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(false)

    const mockAuthContext2 = {
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn()
    }

    mockUseContext.mockReturnValue(mockAuthContext2)
    rerender()

    expect(result.current.isAuthenticated).toBe(true);
  })
})

import { config } from '@/lib/config'

// Define API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

// Define API error class
export class ApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// Define retry configuration
const retryConfig = {
  maxRetries: 3,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 5000, // 5 seconds
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to calculate exponential backoff
const getRetryDelay = (attempt: number) => {
  const delay = Math.min(
    retryConfig.initialRetryDelay * Math.pow(2, attempt),
    retryConfig.maxRetryDelay
  )
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000
}

// Generic fetch wrapper with retries
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...config.api.headers,
        ...options.headers,
      },
    })

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new ApiError(
        'Invalid response format',
        response.status,
        'INVALID_RESPONSE_FORMAT'
      )
    }

    const data = await response.json()

    // Check for API-specific error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || 'API request failed',
        response.status,
        data.code || 'UNKNOWN_ERROR'
      )
    }

    return {
      data,
      error: null,
      status: response.status,
    }
  } catch (error) {
    // Handle network errors or API errors
    if (error instanceof ApiError) {
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        return {
          data: null,
          error: error.message,
          status: error.status,
        }
      }
    }

    // Retry on server errors (5xx) or rate limiting (429)
    if (retryCount < retryConfig.maxRetries) {
      const retryDelay = getRetryDelay(retryCount)
      await delay(retryDelay)
      return fetchWithRetry(url, options, retryCount + 1)
    }

    // Return error after all retries are exhausted
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: error instanceof ApiError ? error.status : 500,
    }
  }
}

// API client class
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = config.api.baseUrl) {
    this.baseUrl = baseUrl
  }

  // Helper to build URL
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return url.toString()
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(
      this.buildUrl(endpoint, params),
      {
        method: 'GET',
      }
    )
  }

  // Generic POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(
      this.buildUrl(endpoint),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  // Generic PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(
      this.buildUrl(endpoint),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
  }

  // Generic DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(
      this.buildUrl(endpoint),
      {
        method: 'DELETE',
      }
    )
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient() 
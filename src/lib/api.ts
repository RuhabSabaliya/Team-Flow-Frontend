/**
 * TeamFlow API Client
 * 
 * Configured to connect to the Express backend (default: http://localhost:2811/api/v1).
 * Always includes credentials (cookies) for HttpOnly access and refresh tokens.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2811/api/v1';

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: Array<{ field?: string; message: string }>;

  constructor(status: number, errorData: ApiErrorResponse['error']) {
    super(errorData.message);
    this.status = status;
    this.code = errorData.code;
    this.details = errorData.details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Sends HttpOnly authentication cookies
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data && data.error) {
      throw new ApiError(response.status, data.error);
    }
    throw new ApiError(response.status, {
      code: 'HTTP_ERROR',
      message: response.statusText || 'Request failed'
    });
  }

  return data as T;
}

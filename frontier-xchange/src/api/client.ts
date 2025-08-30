import { CONFIG } from '@/config';

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchJSON<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  if (!CONFIG.API_BASE_URL) {
    throw new APIError('API not configured', 0);
  }

  const url = `${CONFIG.API_BASE_URL}${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    let errorData;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Ignore parsing errors
    }
    
    throw new APIError(errorMessage, response.status, errorData);
  }

  return response.json();
}
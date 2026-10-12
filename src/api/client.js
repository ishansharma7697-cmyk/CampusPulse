import { ENV } from '../config/env.config.js';

/**
 * Standardized API Error wrapper
 */
export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Enterprise HTTP Client with timeout, structured errors, and headers
 */
class ApiClient {
  constructor(baseURL, timeout = ENV.API.TIMEOUT_MS) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Version': ENV.APP_VERSION,
      ...options.headers
    };

    try {
      // In local/mock mode, we simulate network latency and return controlled responses
      if (options.mockHandler) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return await options.mockHandler();
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        let errorDetails = null;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }
        throw new ApiError(
          errorDetails?.message || `HTTP ${response.status} on ${endpoint}`,
          response.status,
          errorDetails
        );
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new ApiError(`Request timeout after ${this.timeout}ms on ${endpoint}`, 408);
      }
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err.message || 'Unknown network error occurred', 500, err);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(ENV.API.BASE_URL);
export default apiClient;

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '../constants/config';
import { APIError, APIResponse } from '../types';

// ==========================================
// Event & Listener Subscriptions (Loading & Toast)
// ==========================================

type LoadingListener = (isLoading: boolean) => void;
type ToastListener = (type: 'success' | 'error' | 'info', message: string) => void;

let loadingListeners: LoadingListener[] = [];
let toastListeners: ToastListener[] = [];

let activeRequestsCount = 0;

function notifyLoading(isLoading: boolean) {
  loadingListeners.forEach((listener) => listener(isLoading));
}

export function subscribeLoading(listener: LoadingListener) {
  loadingListeners.push(listener);
  return () => {
    loadingListeners = loadingListeners.filter((l) => l !== listener);
  };
}

export function subscribeToast(listener: ToastListener) {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter((l) => l !== listener);
  };
}

export function triggerToast(type: 'success' | 'error' | 'info', message: string) {
  toastListeners.forEach((listener) => listener(type, message));
}

// ==========================================
// Axios Instance Configuration
// ==========================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ==========================================
// Request Interceptor
// ==========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Increment active loading count & trigger global loading UI
    if (activeRequestsCount === 0) {
      notifyLoading(true);
    }
    activeRequestsCount++;

    // Attach auth header if available in localStorage
    const token = localStorage.getItem('gigshield_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
      notifyLoading(false);
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor
// ==========================================
apiClient.interceptors.response.use(
  (response: AxiosResponse<APIResponse>) => {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
      notifyLoading(false);
    }

    // Optional toast notification for successful write operations
    if (['post', 'put', 'delete'].includes(response.config.method?.toLowerCase() || '')) {
      if (response.data?.message) {
        triggerToast('success', response.data.message);
      }
    }

    return response;
  },
  (error) => {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
      notifyLoading(false);
    }

    const apiError: APIError = {
      success: false,
      message: 'An unexpected network error occurred.',
      statusCode: error.response?.status,
    };

    if (error.response?.data) {
      apiError.message = error.response.data.message || error.response.data.detail || apiError.message;
      apiError.errorCode = error.response.data.errorCode;
      apiError.details = error.response.data.details;
    } else if (error.request) {
      apiError.message = 'Backend server is unreachable. Please check backend API server status.';
    } else {
      apiError.message = error.message || apiError.message;
    }

    // Trigger toast alert for errors
    triggerToast('error', apiError.message);

    return Promise.reject(apiError);
  }
);

// ==========================================
// Mock Mode Executor with Simulated Delay
// ==========================================

export async function executeApiCall<T>(
  realApiCall: () => Promise<T>,
  mockGenerator: () => T | Promise<T>,
  delayMs = 400
): Promise<APIResponse<T>> {
  notifyLoading(true);

  try {
    if (CONFIG.USE_MOCK) {
      // Simulate network latency for mock mode
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      const mockResult = await mockGenerator();
      notifyLoading(false);
      return {
        success: true,
        data: mockResult,
        message: '[Mock Mode] Operation successful',
        timestamp: new Date().toISOString(),
      };
    }

    // Real API Call
    const result = await realApiCall();
    notifyLoading(false);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    notifyLoading(false);
    const errorMsg = err?.message || 'API request failed';
    triggerToast('error', errorMsg);
    throw err;
  }
}

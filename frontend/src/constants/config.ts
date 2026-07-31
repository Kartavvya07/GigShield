/**
 * Global Configuration & Environment Settings for GigShield
 */
export const CONFIG = {
  /** Base URL for backend FastAPI service */
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api',

  /** Global switch to toggle between Mock Data and Real Backend */
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true,

  /** API Request timeout in milliseconds */
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
} as const;

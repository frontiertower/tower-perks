export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string | undefined,
  POLL_INTERVAL_MS: 3000,          // webhook-pending polling
  POLL_TIMEOUT_MS: 45000,          // give up after 45s
};
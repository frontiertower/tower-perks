/**
 * Lightweight analytics interface
 * Currently logs to console, can be swapped to PostHog later
 */
export function track(event: string, props?: Record<string, unknown>) {
  console.info(`[Analytics] ${event}`, props || {});
}

export function useAnalytics() {
  return { track };
}

// Event types for consistency
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  JOB_SUBMITTED: 'job_submitted',
  CHECKOUT_OPENED: 'checkout_opened',
  CHECKOUT_PAID_PENDING_PUBLISH: 'checkout_paid_pending_publish',
  JOB_PUBLISHED_PUBLIC: 'job_published_public',
  BOUNTY_CLAIM_CLICKED: 'bounty_claim_clicked',
  BOUNTY_CLAIM_CONFLICT: 'bounty_claim_conflict',
  BOUNTY_MARK_COMPLETE: 'bounty_mark_complete',
  LIST_FILTERS_CHANGED: 'list_filters_changed',
} as const;
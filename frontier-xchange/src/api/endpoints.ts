// Jobs
export const ENDPOINTS = {
  // Jobs
  CREATE_JOB: '/api/jobs',
  GET_JOB: (id: string) => `/api/jobs/${id}`,
  GET_MY_JOBS: '/api/jobs/mine',
  
  // Bounties
  GET_BOUNTIES: '/api/bounties',
  CLAIM_BOUNTY: '/api/bounties/claim',
  COMPLETE_BOUNTY: '/api/bounties/complete',
} as const;
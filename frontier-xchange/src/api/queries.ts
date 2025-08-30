import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJSON } from './client';
import { ENDPOINTS } from './endpoints';
import type { 
  Job, 
  CreateJobBody, 
  CreateJobResponse, 
  ClaimBody, 
  CompleteBody, 
  ListBountiesQuery 
} from './types';

// Query Keys
export const QUERY_KEYS = {
  job: (id: string) => ['job', id] as const,
  myJobs: (posterId: string) => ['myJobs', posterId] as const,
  bounties: (filters: ListBountiesQuery) => ['bounties', filters] as const,
} as const;

// Jobs
export function useJob(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.job(id),
    queryFn: () => fetchJSON<Job>(ENDPOINTS.GET_JOB(id)),
    enabled: !!id,
  });
}

export function useMyJobs(posterId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.myJobs(posterId),
    queryFn: () => fetchJSON<Job[]>(`${ENDPOINTS.GET_MY_JOBS}?role=poster&postedById=${posterId}`),
    enabled: !!posterId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateJobBody) => 
      fetchJSON<CreateJobResponse>(ENDPOINTS.CREATE_JOB, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      // Invalidate my jobs list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.myJobs(variables.postedById) 
      });
    },
  });
}

// Bounties
export function useBounties(filters: ListBountiesQuery = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.category?.length) {
    filters.category.forEach(cat => queryParams.append('category', cat));
  }
  if (filters.minBudget) queryParams.append('minBudget', filters.minBudget.toString());
  if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget.toString());
  if (filters.dueSoon) queryParams.append('dueSoon', 'true');
  if (filters.mine) queryParams.append('mine', 'true');

  const queryString = queryParams.toString();
  const url = queryString ? `${ENDPOINTS.GET_BOUNTIES}?${queryString}` : ENDPOINTS.GET_BOUNTIES;

  return useQuery({
    queryKey: QUERY_KEYS.bounties(filters),
    queryFn: () => fetchJSON<Job[]>(url),
  });
}

export function useClaimBounty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ClaimBody) =>
      fetchJSON<Job>(ENDPOINTS.CLAIM_BOUNTY, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate all bounties queries
      queryClient.invalidateQueries({ 
        queryKey: ['bounties'] 
      });
    },
  });
}

export function useCompleteBounty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CompleteBody) =>
      fetchJSON<Job>(ENDPOINTS.COMPLETE_BOUNTY, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate all bounties queries
      queryClient.invalidateQueries({ 
        queryKey: ['bounties'] 
      });
    },
  });
}
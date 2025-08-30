import { useEffect, useState } from 'react';
import { useJob } from '@/api/queries';
import { CONFIG } from '@/config';

interface PollState {
  state: 'idle' | 'pending' | 'public' | 'timeout';
  remainingMs: number;
}

export function usePollVisibility(jobId: string | null) {
  const [pollState, setPollState] = useState<PollState>({
    state: 'idle',
    remainingMs: CONFIG.POLL_TIMEOUT_MS,
  });

  const { data: job, refetch } = useJob(jobId || '');

  useEffect(() => {
    if (!jobId) {
      setPollState({ state: 'idle', remainingMs: CONFIG.POLL_TIMEOUT_MS });
      return;
    }

    // Check if already public
    if (job?.visibility === 'PUBLIC') {
      setPollState({ state: 'public', remainingMs: 0 });
      return;
    }

    // Start polling
    setPollState({ state: 'pending', remainingMs: CONFIG.POLL_TIMEOUT_MS });
    
    const startTime = Date.now();
    const intervalId = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      const remaining = CONFIG.POLL_TIMEOUT_MS - elapsed;

      if (remaining <= 0) {
        setPollState({ state: 'timeout', remainingMs: 0 });
        clearInterval(intervalId);
        return;
      }

      setPollState(prev => ({ ...prev, remainingMs: remaining }));

      // Refetch job data
      const { data: refreshedJob } = await refetch();
      
      if (refreshedJob?.visibility === 'PUBLIC') {
        setPollState({ state: 'public', remainingMs: remaining });
        clearInterval(intervalId);
      }
    }, CONFIG.POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [jobId, job?.visibility, refetch]);

  return pollState;
}
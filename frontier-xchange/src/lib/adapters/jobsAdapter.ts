import type { Job } from '@/types/job';
import { useJobsStore } from '@/store/jobsStore';

export interface CreateJobInput {
  title: string;
  category: Job['category'];
  description: string;
  budget: number;
  deadlineISO?: string;
  postedById: string;
  postedByEmail?: string;
}

export class JobsAdapter {
  static async list(): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return useJobsStore.getState().jobs;
  }

  static async create(input: CreateJobInput): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const job: Job = {
      id: `job-${Math.random().toString(36).substr(2, 9)}`,
      ...input,
      currency: 'USD',
      status: 'OPEN',
      createdAtISO: new Date().toISOString(),
    };

    useJobsStore.getState().addJob(job);
    return job;
  }

  static async claim(jobId: string, memberId: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const updates = {
      status: 'IN_PROGRESS' as const,
      claimedById: memberId,
      claimedAtISO: new Date().toISOString(),
    };

    useJobsStore.getState().updateJob(jobId, updates);
    
    const updatedJob = useJobsStore.getState().getJobById(jobId);
    if (!updatedJob) throw new Error('Job not found');
    return updatedJob;
  }

  static async complete(jobId: string, deliverableUrl?: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const updates = {
      status: 'COMPLETED' as const,
      completedAtISO: new Date().toISOString(),
      ...(deliverableUrl && { deliverableUrl }),
    };

    useJobsStore.getState().updateJob(jobId, updates);
    
    const updatedJob = useJobsStore.getState().getJobById(jobId);
    if (!updatedJob) throw new Error('Job not found');
    return updatedJob;
  }

  static async cancel(jobId: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const updates = {
      status: 'CANCELLED' as const,
    };

    useJobsStore.getState().updateJob(jobId, updates);
    
    const updatedJob = useJobsStore.getState().getJobById(jobId);
    if (!updatedJob) throw new Error('Job not found');
    return updatedJob;
  }
}
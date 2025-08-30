import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Job, JobStatus } from '@/types/job';

interface JobsState {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsByUserId: (userId: string) => Job[];
  getJobsByClaimerId: (claimerId: string) => Job[];
  getOpenJobs: () => Job[];
  getJobsCount: () => {
    open: number;
    inProgress: number;
    completed: number;
    totalValue: number;
  };
}

// Seed data for demo
const seedJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Custom Phone Stand Design',
    category: '3D_PRINTING',
    description: 'Need a custom phone stand that can hold my phone in both portrait and landscape orientations. Should be stable and work for phones 4-7 inches.',
    budget: 25,
    currency: 'USD',
    deadlineISO: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'OPEN',
    createdAtISO: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    postedById: 'guest-abc123',
    postedByEmail: 'user@example.com',
  },
  {
    id: 'job-2',
    title: 'Laser Cut Wooden Box',
    category: 'LASER_CUTTING',
    description: 'I need a precision wooden box with custom dimensions: 8"x6"x4". Should have finger joints and a sliding lid. Material preference: 1/4" plywood.',
    budget: 45,
    currency: 'USD',
    deadlineISO: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    createdAtISO: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    postedById: 'guest-def456',
    postedByEmail: 'creator@example.com',
    claimedById: 'member-xyz789',
    claimedAtISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-3',
    title: 'Arduino Project Help',
    category: 'CONSULTATION',
    description: 'Need help debugging my Arduino temperature sensor project. The readings are inconsistent and I suspect there\'s an issue with my circuit design.',
    budget: 30,
    currency: 'USD',
    status: 'COMPLETED',
    createdAtISO: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    postedById: 'guest-ghi789',
    postedByEmail: 'maker@example.com',
    claimedById: 'member-abc123',
    claimedAtISO: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    completedAtISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliverableUrl: 'https://github.com/example/arduino-fix',
  },
  {
    id: 'job-4',
    title: 'Product Logo Design',
    category: 'DESIGN_HELP',
    description: 'Looking for someone to help design a clean, modern logo for my maker project. It\'s a smart home device and needs to feel tech-forward but approachable.',
    budget: 60,
    currency: 'USD',
    deadlineISO: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'OPEN',
    createdAtISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    postedById: 'guest-jkl012',
    postedByEmail: 'designer@example.com',
  },
  {
    id: 'job-5',
    title: 'PCB Assembly Consultation',
    category: 'OTHER',
    description: 'I have the PCB design ready but need guidance on component placement and soldering techniques for surface-mount components. Virtual or in-person help welcome.',
    budget: 40,
    currency: 'USD',
    deadlineISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'OPEN',
    createdAtISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    postedById: 'guest-mno345',
    postedByEmail: 'electronics@example.com',
  },
];

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: seedJobs,
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map(job => job.id === id ? { ...job, ...updates } : job)
      })),
      getJobById: (id) => get().jobs.find(job => job.id === id),
      getJobsByUserId: (userId) => get().jobs.filter(job => job.postedById === userId),
      getJobsByClaimerId: (claimerId) => get().jobs.filter(job => job.claimedById === claimerId),
      getOpenJobs: () => get().jobs.filter(job => job.status === 'OPEN'),
      getJobsCount: () => {
        const jobs = get().jobs;
        return {
          open: jobs.filter(j => j.status === 'OPEN').length,
          inProgress: jobs.filter(j => j.status === 'IN_PROGRESS').length,
          completed: jobs.filter(j => j.status === 'COMPLETED').length,
          totalValue: jobs.reduce((sum, j) => sum + j.budget, 0),
        };
      },
    }),
    {
      name: 'jobs-store',
    }
  )
);
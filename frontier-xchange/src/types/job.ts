export type JobCategory =
  | '3D_PRINTING'
  | 'LASER_CUTTING'
  | 'DESIGN_HELP'
  | 'CONSULTATION'
  | 'OTHER';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  description: string;
  budget: number;
  currency: 'USD';
  deadlineISO?: string;
  status: JobStatus;
  createdAtISO: string;
  postedById: string;
  postedByEmail?: string;
  claimedById?: string;
  claimedAtISO?: string;
  completedAtISO?: string;
  deliverableUrl?: string;
}

export interface JobFilters {
  categories: JobCategory[];
  statuses: JobStatus[];
  budgetMin?: number;
  budgetMax?: number;
  dueSoon: boolean;
}

export const JOB_CATEGORIES = {
  '3D_PRINTING': '3D Printing',
  'LASER_CUTTING': 'Laser Cutting',
  'DESIGN_HELP': 'Design Help',
  'CONSULTATION': 'Consultation',
  'OTHER': 'Other'
} as const;

export const JOB_STATUSES = {
  'OPEN': 'Open',
  'IN_PROGRESS': 'In Progress', 
  'COMPLETED': 'Completed',
  'CANCELLED': 'Cancelled'
} as const;
export type JobCategory = '3D_PRINTING' | 'LASER_CUTTING' | 'DESIGN_HELP' | 'CONSULTATION' | 'OTHER';
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Service = 'BAMBU_X1C' | 'H2D' | 'LASER';
export type Visibility = 'PRIVATE' | 'PUBLIC';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Job {
  id: string;                  // Use notionPageId as id for compatibility
  notionPageId: string;
  title: string;
  category: JobCategory;
  description: string;
  budget: number;              // Keep budget for backward compatibility
  budgetUSD: number;          // New field for API consistency
  currency: 'USD';
  deadlineISO?: string;
  status: JobStatus;
  visibility: Visibility;
  postedByEmail?: string;      // never render publicly
  postedById: string;
  claimedById?: string;
  claimedAtISO?: string;       // Added missing field
  completedAtISO?: string;     // Added missing field
  deliverableUrl?: string;
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  paymentStatus?: PaymentStatus;
  createdAtISO: string;
  paidAtISO?: string;
}

export interface CreateJobBody {
  title: string;
  category: JobCategory;
  description: string;
  budget: number;
  deadlineISO?: string;
  postedByEmail: string;
  postedById: string;
  service: Service;  // 'BAMBU_X1C' | 'H2D' | 'LASER'
}

export interface CreateJobResponse {
  ok: boolean;
  data?: { notionPageId: string; stripeSessionId: string; checkoutUrl: string };
  error?: string;
}

export interface ClaimBody { 
  notionPageId: string; 
  claimedById: string; 
}

export interface CompleteBody { 
  notionPageId: string; 
  deliverableUrl?: string; 
}

export interface ListBountiesQuery {
  status?: JobStatus;                // defaults: OPEN | IN_PROGRESS | COMPLETED
  category?: JobCategory[];
  minBudget?: number;
  maxBudget?: number;
  dueSoon?: boolean;                 // deadline within 72h
  mine?: boolean;                    // only my claimed jobs
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

export const SERVICES = {
  'BAMBU_X1C': { name: 'Bambu X1 Carbon', fee: 5 },
  'H2D': { name: 'H2D', fee: 7 },
  'LASER': { name: 'Laser Cutter', fee: 20 }
} as const;
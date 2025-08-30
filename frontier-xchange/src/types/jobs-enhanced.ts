export type JobCategory =
  | '3D_PRINTING'
  | 'LASER_CUTTING'
  | 'DESIGN_HELP'
  | 'CONSULTATION'
  | 'OTHER';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PaymentType = 'MONETARY' | 'IN_KIND' | 'HYBRID';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  description: string;
  budget_usd?: number;
  currency: string;
  deadline_iso?: string;
  status: JobStatus;
  payment_type: PaymentType;
  in_kind_description?: string;
  posted_by_id: string;
  posted_by_email?: string;
  claimed_by_id?: string;
  claimed_at_iso?: string;
  completed_at_iso?: string;
  deliverable_url?: string;
  service_type?: string; // 'BAMBU_X1C' | 'H2D' | 'LASER'
  is_standard_rate: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobOffer {
  id: string;
  job_id: string;
  offered_by_id: string;
  offered_by_email?: string;
  offer_amount_usd?: number;
  offer_payment_type: PaymentType;
  offer_in_kind_description?: string;
  message?: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  title: string;
  category: JobCategory;
  description: string;
  budget_usd?: number;
  payment_type: PaymentType;
  in_kind_description?: string;
  deadline_iso?: string;
  posted_by_id: string;
  posted_by_email?: string;
  service_type?: string;
  is_standard_rate: boolean;
}

export interface CreateOfferInput {
  job_id: string;
  offered_by_id: string;
  offered_by_email?: string;
  offer_amount_usd?: number;
  offer_payment_type: PaymentType;
  offer_in_kind_description?: string;
  message?: string;
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

export const PAYMENT_TYPES = {
  'MONETARY': 'Cash Payment',
  'IN_KIND': 'Trade/Barter',
  'HYBRID': 'Cash + Trade'
} as const;

export const STANDARD_RATES = {
  'BAMBU_X1C': { name: 'Bambu Lab X1 Carbon', base_rate: 5 },
  'H2D': { name: 'Bambu Lab H2D', base_rate: 7 },
  'LASER': { name: 'Laser Cutting', base_rate: 20 }
} as const;
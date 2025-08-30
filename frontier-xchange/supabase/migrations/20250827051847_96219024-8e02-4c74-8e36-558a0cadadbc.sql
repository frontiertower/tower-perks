-- First, let's create the payment types enum
CREATE TYPE public.payment_type AS ENUM ('MONETARY', 'IN_KIND', 'HYBRID');

-- Create payment status enum for offers
CREATE TYPE public.offer_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- Create jobs table to replace the current adapter system
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  budget_usd DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  deadline_iso TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'OPEN',
  payment_type payment_type NOT NULL DEFAULT 'MONETARY',
  in_kind_description TEXT, -- What they're offering in exchange
  posted_by_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  posted_by_email TEXT,
  claimed_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at_iso TIMESTAMPTZ,
  completed_at_iso TIMESTAMPTZ,
  deliverable_url TEXT,
  service_type TEXT, -- For 3D printing jobs: 'BAMBU_X1C', 'H2D', 'LASER'
  is_standard_rate BOOLEAN DEFAULT FALSE, -- Whether this uses fixed service rates
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create counter offers table
CREATE TABLE public.job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  offered_by_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offered_by_email TEXT,
  offer_amount_usd DECIMAL(10,2),
  offer_payment_type payment_type NOT NULL DEFAULT 'MONETARY',
  offer_in_kind_description TEXT,
  message TEXT,
  status offer_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Anyone can view open jobs"
ON public.jobs
FOR SELECT
USING (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED'));

CREATE POLICY "Users can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (auth.uid() = posted_by_id);

CREATE POLICY "Job posters can update their jobs"
ON public.jobs
FOR UPDATE
USING (auth.uid() = posted_by_id);

CREATE POLICY "Claimers can update claimed jobs"
ON public.jobs
FOR UPDATE
USING (auth.uid() = claimed_by_id);

-- Job offers policies
CREATE POLICY "Anyone can view job offers"
ON public.job_offers
FOR SELECT
USING (true);

CREATE POLICY "Users can create offers"
ON public.job_offers
FOR INSERT
WITH CHECK (auth.uid() = offered_by_id);

CREATE POLICY "Offer creators can update their offers"
ON public.job_offers
FOR UPDATE
USING (auth.uid() = offered_by_id);

-- Function to update timestamps
CREATE TRIGGER jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER job_offers_updated_at
BEFORE UPDATE ON public.job_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
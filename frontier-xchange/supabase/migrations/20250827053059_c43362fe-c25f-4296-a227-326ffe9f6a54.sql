-- Update RLS policies for better job visibility and functionality

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view open jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can create jobs" ON public.jobs;
DROP POLICY IF EXISTS "Job posters can update their jobs" ON public.jobs;
DROP POLICY IF EXISTS "Claimers can update claimed jobs" ON public.jobs;

-- Create more permissive policies for better functionality
-- Allow all authenticated users to view all jobs (not just open ones)
CREATE POLICY "Authenticated users can view all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to create jobs
CREATE POLICY "Authenticated users can create jobs"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = posted_by_id);

-- Allow job creators to update their own jobs
CREATE POLICY "Job creators can update their jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = posted_by_id);

-- Allow job claimers to update jobs they've claimed
CREATE POLICY "Job claimers can update claimed jobs"
ON public.jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = claimed_by_id);

-- Allow job creators to delete their own unclaimed jobs
CREATE POLICY "Job creators can delete unclaimed jobs"
ON public.jobs
FOR DELETE
TO authenticated
USING (auth.uid() = posted_by_id AND claimed_by_id IS NULL);
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/jobs-enhanced';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  search: string;
  category: string;
  paymentType: string;
  status: string;
}

export function useRealtimeJobs(filters: FilterState) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.paymentType) {
        query = query.eq('payment_type', filters.paymentType);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setJobs((data || []) as Job[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Fallback to demo backend if Supabase fails
      try {
        const response = await fetch('http://localhost:8000/rest/v1/jobs');
        if (response.ok) {
          const demoJobs = await response.json();
          setJobs(demoJobs as Job[]);
          toast({
            title: "Using demo backend",
            description: "Connected to local demo server for job data.",
          });
        }
      } catch (demoError) {
        console.error('Demo backend also failed:', demoError);
        toast({
          title: "Connection error",
          description: "Unable to load jobs. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'jobs',
        },
        (payload) => {
          console.log('Real-time job change:', payload);
          
          const newJob = payload.new as Job;
          const oldJob = payload.old as Job;
          
          if (payload.eventType === 'INSERT') {
            // New job posted
            setJobs(prev => [newJob, ...prev]);
            toast({
              title: "New job posted!",
              description: `"${newJob.title}" just appeared on the board.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            // Job updated
            setJobs(prev => prev.map(job => 
              job.id === newJob.id ? newJob : job
            ));
            
            // Show notification for status changes
            if (oldJob.status !== newJob.status) {
              const statusMessages = {
                'CLAIMED': `"${newJob.title}" was just claimed!`,
                'IN_PROGRESS': `"${newJob.title}" is now in progress.`,
                'COMPLETED': `"${newJob.title}" has been completed!`,
                'CANCELLED': `"${newJob.title}" was cancelled.`,
              };
              
              const message = statusMessages[newJob.status as keyof typeof statusMessages];
              if (message) {
                toast({
                  title: "Job status updated",
                  description: message,
                });
              }
            }
          } else if (payload.eventType === 'DELETE') {
            // Job deleted
            setJobs(prev => prev.filter(job => job.id !== oldJob.id));
            toast({
              title: "Job removed",
              description: `"${oldJob.title}" was removed from the board.`,
            });
          }
        }
      )
      .subscribe();

    // Also listen for job offers changes
    const offersChannel = supabase
      .channel('job-offers-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_offers',
        },
        (payload) => {
          console.log('New job offer:', payload);
          const offer = payload.new as Record<string, unknown>;
          
          toast({
            title: "New offer received!",
            description: `Someone made an offer on a job.`,
          });
          
          // Refresh jobs to get updated offer counts
          fetchJobs();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(offersChannel);
    };
  }, [toast]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  return {
    jobs,
    loading,
    refetch: fetchJobs,
  };
}
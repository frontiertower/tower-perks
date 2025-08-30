import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, TrendingUp, Play } from 'lucide-react';

export function RealtimeTestPanel() {
  const [isRunning, setIsRunning] = useState(false);

  const createTestJob = async () => {
    const testJobs = [
      {
        title: "Test 3D Printed Bracket",
        category: "3D_PRINTING", 
        description: "Testing real-time job posting functionality",
        payment_type: "MONETARY",
        budget_usd: 15,
        service_type: "BAMBU_X1C",
        is_standard_rate: true,
        posted_by_email: "test@realtime.com"
      },
      {
        title: "Test Laser Cut Sign",
        category: "LASER_CUTTING",
        description: "Another test job for real-time updates",
        payment_type: "HYBRID", 
        budget_usd: 30,
        in_kind_description: "Materials provided",
        service_type: "LASER",
        is_standard_rate: true,
        posted_by_email: "maker@realtime.com"
      }
    ];

    const randomJob = testJobs[Math.floor(Math.random() * testJobs.length)];
    
    try {
      const response = await fetch('http://localhost:8000/rest/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        },
        body: JSON.stringify([randomJob])
      });

      if (!response.ok) throw new Error('Failed to create test job');
      console.log('Test job created successfully');
    } catch (error) {
      console.error('Failed to create test job:', error);
    }
  };

  const createTestOffer = async () => {
    // Get a random job ID from the demo backend
    try {
      const jobsResponse = await fetch('http://localhost:8000/rest/v1/jobs');
      const jobs = await jobsResponse.json();
      
      if (jobs.length === 0) {
        console.log('No jobs available to make offers on');
        return;
      }
      
      const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
      
      const testOffer = {
        job_id: randomJob.id,
        offer_amount_usd: randomJob.budget_usd + 10,
        offer_payment_type: "MONETARY",
        message: "I can complete this job with premium quality and fast delivery!",
        offered_by_email: "contractor@realtime.com"
      };

      const response = await fetch('http://localhost:8000/rest/v1/job_offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token'
        },
        body: JSON.stringify([testOffer])
      });

      if (!response.ok) throw new Error('Failed to create test offer');
      console.log('Test offer created successfully');
    } catch (error) {
      console.error('Failed to create test offer:', error);
    }
  };

  const runSimulation = async () => {
    setIsRunning(true);
    
    try {
      // Create a series of test activities with delays
      await createTestJob();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await createTestOffer();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await createTestJob();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await createTestOffer();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Zap className="w-5 h-5" />
          Real-time Testing Panel
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-300">
            Demo Backend
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-orange-600">
          Test the real-time job board updates by simulating activities against the demo backend.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={createTestJob}
            disabled={isRunning}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <Users className="w-4 h-4 mr-1" />
            Create Test Job
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={createTestOffer}
            disabled={isRunning}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Create Test Offer
          </Button>
          
          <Button 
            onClick={runSimulation}
            disabled={isRunning}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? 'Running Simulation...' : 'Run Full Simulation'}
          </Button>
        </div>
        
        <div className="text-xs text-orange-600/80">
          💡 Watch the jobs list and activity banner above for live updates as you create test data.
        </div>
      </CardContent>
    </Card>
  );
}
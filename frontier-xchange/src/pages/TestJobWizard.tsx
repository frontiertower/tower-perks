import { EnhancedJobWizard } from '@/components/jobs/EnhancedJobWizard';

export default function TestJobWizard() {
  const handleJobCreated = () => {
    console.log('Job created successfully!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Enhanced Job Wizard</h1>
        <EnhancedJobWizard onJobCreated={handleJobCreated} />
      </div>
    </div>
  );
}
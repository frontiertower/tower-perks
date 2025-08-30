import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-primary-600">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>
        
        {/* Additional Help */}
        <div className="mt-12 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Can't find what you're looking for? Try these options:
          </p>
          <div className="space-y-1 text-sm">
            <Link to="/inventory" className="block text-primary-600 hover:text-primary-700">
              → Browse Equipment Inventory
            </Link>
            <Link to="/events" className="block text-primary-600 hover:text-primary-700">
              → View Upcoming Events
            </Link>
            <Link to="/marketplace" className="block text-primary-600 hover:text-primary-700">
              → Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
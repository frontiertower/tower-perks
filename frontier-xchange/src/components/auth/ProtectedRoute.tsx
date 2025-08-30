import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMakerspace?: boolean;
}

export function ProtectedRoute({ children, requireMakerspace = false }: ProtectedRouteProps) {
  const { user, profile, loading, isMakerspaceMember } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireMakerspace && !isMakerspaceMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-warning/10 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Makerspace Access Required
          </h2>
          <p className="text-muted-foreground mb-4">
            This feature is only available to Makerspace Members. Contact an admin to upgrade your account.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
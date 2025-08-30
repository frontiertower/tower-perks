import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Zap, Chrome, ArrowRight, Sparkles } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.fullName);
        if (!result.error) {
          toast({
            title: "Account created!",
            description: "Check your email to verify your account.",
          });
        }
      } else {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          window.location.href = '/dashboard';
        }
      }

      if (result.error) {
        toast({
          title: "Authentication failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign-in...');
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Authentication failed. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-animated">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-background to-primary-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary))_0%,transparent_50%)] opacity-10 animate-floating-orbs" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent))_0%,transparent_50%)] opacity-15 animate-floating-orbs" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,hsl(var(--primary-300))_0%,transparent_40%)] opacity-20 animate-floating-orbs" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-primary/30 rounded-full animate-floating-orbs" style={{ top: '10%', left: '10%', animationDuration: '15s' }} />
        <div className="absolute w-1 h-1 bg-accent/40 rounded-full animate-floating-orbs" style={{ top: '20%', left: '80%', animationDuration: '20s', animationDelay: '-3s' }} />
        <div className="absolute w-3 h-3 bg-primary-300/20 rounded-full animate-floating-orbs" style={{ top: '70%', left: '15%', animationDuration: '18s', animationDelay: '-7s' }} />
        <div className="absolute w-1.5 h-1.5 bg-primary-400/30 rounded-full animate-floating-orbs" style={{ top: '80%', left: '85%', animationDuration: '25s', animationDelay: '-12s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md glass-strong animate-slide-in-up">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-lg flex items-center justify-center mb-4 animate-pulse-gentle">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Frontier Makerspace
              </h1>
              <p className="text-muted-foreground">
                {isSignUp ? 'Join our community of makers' : 'Welcome back to the portal'}
              </p>
            </div>

            {/* OAuth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 group hover-glow transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              <Chrome className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Continue with Google
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="h-12 focus-ring"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-12 focus-ring"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary hover:shadow-green transition-all duration-300 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
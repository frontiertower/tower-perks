import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'member' | 'makerspace_member';
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: unknown }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>;
  isMakerspaceMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isMakerspaceMember = profile?.role === 'makerspace_member';

  const fetchProfile = async (userId: string) => {
    try {
      console.log('=== Fetching Profile ===');
      console.log('User ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        if (error.code === 'PGRST116') {
          console.log('Profile not found, user may need to complete setup');
        }
        return;
      }

      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    console.log('=== Auth Context Initializing ===');
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth State Change ===');
        console.log('Event:', event);
        console.log('Session exists:', !!session);
        console.log('User ID:', session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          console.log('No user session, clearing profile');
          setProfile(null);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('=== Initial Session Check ===');
      console.log('Session exists:', !!session);
      console.log('Session error:', error);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('Existing session found, fetching profile...');
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        console.log('No existing session');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    try {
      // Clean up any existing auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('=== Google OAuth Flow Started ===');
      console.log('Current origin:', window.location.origin);
      console.log('Redirect URL:', `${window.location.origin}/dashboard`);
      console.log('Supabase project:', 'oipoihniimisvdzqvkem');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            'prompt': 'select_account',
          }
        },
      });
      
      console.log('OAuth response data:', data);
      if (error) {
        console.error('=== OAuth Error ===');
        console.error('Error code:', error.status || error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
      } else {
        console.log('OAuth initiated successfully');
      }
      
      return { error };
    } catch (err) {
      console.error('=== Unexpected OAuth Error ===', err);
      return { error: err };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user found' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates } as Profile);
    }

    return { error };
  };

  // Handle hot reload issues after all hooks are called
  if (typeof useState !== 'function') {
    console.error('React hooks not available - hot reload issue detected');
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      updateProfile,
      isMakerspaceMember,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import { checkIsAdminUser } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache admin status to avoid repeated DB calls
const adminCache = new Map<string, { isAdmin: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if user is admin
const checkIsAdmin = async (email: string): Promise<boolean> => {
  // Check cache first
  const cached = adminCache.get(email);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isAdmin;
  }

  // Query database
  const isAdmin = await checkIsAdminUser(email);

  // Cache result
  adminCache.set(email, { isAdmin, timestamp: Date.now() });

  return isAdmin;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
        };
        setUser(userData);
        setLoading(false); // Set loading false BEFORE admin check

        // Check admin status AFTER user is set
        const adminStatus = await checkIsAdmin(session.user.email!);
        if (mounted) setIsAdmin(adminStatus);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
        };
        setUser(userData);

        // TODO: try to remove this delay if possible
        // Check admin after a small delay
        setTimeout(async () => {
          if (!mounted) return;
          const adminStatus = await checkIsAdmin(session.user.email!);
          setIsAdmin(adminStatus);
        }, 100);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
        };
        setUser(userData);
        const adminStatus = await checkIsAdmin(data.user.email!);
        setIsAdmin(adminStatus);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Do not set user here to prevent auto-login.
        // The user must verify their email first.
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    // Clear admin cache on logout
    if (user?.email) {
      adminCache.delete(user.email);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'An error occurred while sending the reset email.' };
    }
  };

  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: 'An error occurred while updating the password.' };
    }
  };

  const value = useMemo(
    () => ({ user, isAdmin, login, register, logout, resetPassword, updatePassword, loading }),
    [user, isAdmin, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

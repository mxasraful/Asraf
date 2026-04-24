import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety fallback: stop loading after 5 seconds regardless of Firebase status
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth state resolution timed out. Defaulting to guest mode.");
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        clearTimeout(safetyTimeout);
      },
      (error) => {
        console.error("Firebase Auth initialization error:", error);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    );

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
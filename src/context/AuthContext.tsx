import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the AuthContext
interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => false
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    checkAuthStatus();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        // Store token in AsyncStorage for persistence
        await AsyncStorage.setItem('token', session.access_token);
      } else {
        setSession(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('token');
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setSession(data.session);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('token', session.access_token);
        setLoading(false);
        return true;
      } else {
        setSession(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('token');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        isAuthenticated, 
        loading, 
        login, 
        logout, 
        checkAuthStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
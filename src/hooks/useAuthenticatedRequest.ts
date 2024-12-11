import { useCallback } from 'react';
import { useAuth } from './useAuth';
import axios, { AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';

interface RequestOptions extends Omit<AxiosRequestConfig, 'headers'> {
  showError?: boolean;
}

export const useAuthenticatedRequest = () => {
  const { session, isAuthenticated, logout } = useAuth();

  const makeRequest = useCallback(async <T = any>(
    options: RequestOptions
  ): Promise<T | null> => {
    if (!isAuthenticated || !session?.access_token) {
      Alert.alert('Error', 'You must be logged in to perform this action');
      return null;
    }

    try {
      const response = await axios({
        ...options,
        baseURL: process.env.API_URL,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired or invalid
        await logout();
        Alert.alert('Session Expired', 'Please log in again');
        return null;
      }

      if (options.showError !== false) {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'An error occurred'
        );
      }

      throw error;
    }
  }, [isAuthenticated, session, logout]);

  return { makeRequest };
};

export default useAuthenticatedRequest;

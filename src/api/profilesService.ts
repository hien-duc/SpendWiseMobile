import { apiClient, handleApiError, ApiResponse } from './config';
import { Profile } from './types';

interface ProfileUpdateInput {
  name?: string;
  email?: string;
  currency?: string;
  initial_balance?: number;
}

export const profilesService = {
  getCurrentProfile: async (): Promise<Profile> => {
    try {
      const response = await apiClient.get<Profile>('/profiles');
      return response.data; // The backend returns the profile directly
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (profileData: ProfileUpdateInput): Promise<Profile> => {
    try {
      const response = await apiClient.put<Profile>('/profiles', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteProfile: async (): Promise<void> => {
    try {
      await apiClient.delete('/profiles');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateInitialBalance: async (initialBalance: number): Promise<Profile> => {
    try {
      // Convert to string first to handle decimal precision correctly
      const decimalString = initialBalance.toFixed(2);
      // Convert back to number to ensure it's a valid decimal
      const cleanBalance = parseFloat(decimalString);

      if (isNaN(cleanBalance)) {
        throw new Error('Invalid balance value');
      }

      // Validate decimal(12,2) constraints
      const wholePart = Math.floor(Math.abs(cleanBalance)).toString();
      if (wholePart.length > 10) { // 10 digits + 2 decimal places = 12 total
        throw new Error('Balance value is too large. Maximum 10 digits before decimal point.');
      }

      const response = await apiClient.patch<Profile>('/profiles/initial-balance', { 
        initial_balance: cleanBalance 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating balance:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw handleApiError(error);
    }
  }
};

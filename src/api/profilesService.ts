import { apiClient, handleApiError, ApiResponse } from './config';
import { Profile } from './types';

interface ProfileUpdateInput {
  name?: string;
  currency?: string;
  initial_balance?: number;
  theme_color?: string;
}

export const profilesService = {
  getCurrentProfile: async (): Promise<Profile> => {
    try {
      const response = await apiClient.get<ApiResponse<Profile>>('/profiles');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (profileData: ProfileUpdateInput): Promise<Profile> => {
    try {
      const response = await apiClient.put<ApiResponse<Profile>>('/profiles', profileData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateCurrency: async (currency: string): Promise<Profile> => {
    try {
      const response = await apiClient.patch<ApiResponse<Profile>>('/profiles/currency', { currency });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateThemeColor: async (themeColor: string): Promise<Profile> => {
    try {
      const response = await apiClient.patch<ApiResponse<Profile>>('/profiles/theme', { theme_color: themeColor });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

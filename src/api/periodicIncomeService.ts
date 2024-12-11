import { apiClient, handleApiError, ApiResponse } from './config';
import { Frequency } from './types';

interface PeriodicIncomeInput {
  category_id: string;
  amount: number;
  frequency: Frequency;
  start_date: string;
  end_date?: string;
  note?: string;
  is_active: boolean;
}

interface PeriodicIncome extends PeriodicIncomeInput {
  id: string;
  last_generated_date?: string;
}

export const periodicIncomeService = {
  getAll: async (): Promise<PeriodicIncome[]> => {
    try {
      const response = await apiClient.get<ApiResponse<PeriodicIncome[]>>('/financial/periodic-income');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<PeriodicIncome> => {
    try {
      const response = await apiClient.get<ApiResponse<PeriodicIncome>>(`/financial/periodic-income/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (periodicIncome: PeriodicIncomeInput): Promise<PeriodicIncome> => {
    try {
      const response = await apiClient.post<ApiResponse<PeriodicIncome>>('/financial/periodic-income', periodicIncome);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, periodicIncome: Partial<PeriodicIncomeInput>): Promise<PeriodicIncome> => {
    try {
      const response = await apiClient.put<ApiResponse<PeriodicIncome>>(`/financial/periodic-income/${id}`, periodicIncome);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/financial/periodic-income/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

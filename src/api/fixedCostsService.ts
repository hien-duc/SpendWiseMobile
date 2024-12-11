import { apiClient, handleApiError, ApiResponse } from './config';
import { FixedCost, Frequency } from './types';

interface FixedCostInput {
  category_id: string;
  amount: number;
  frequency: Frequency;
  start_date: string;
  end_date?: string;
  note?: string;
  is_active: boolean;
}

export const fixedCostsService = {
  getAll: async (): Promise<FixedCost[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FixedCost[]>>('/financial/fixed-costs');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<FixedCost> => {
    try {
      const response = await apiClient.get<ApiResponse<FixedCost>>(`/financial/fixed-costs/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (fixedCost: FixedCostInput): Promise<FixedCost> => {
    try {
      const response = await apiClient.post<ApiResponse<FixedCost>>('/financial/fixed-costs', fixedCost);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, fixedCost: Partial<FixedCostInput>): Promise<FixedCost> => {
    try {
      const response = await apiClient.put<ApiResponse<FixedCost>>(`/financial/fixed-costs/${id}`, fixedCost);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/financial/fixed-costs/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

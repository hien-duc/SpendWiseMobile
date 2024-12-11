import { apiClient, handleApiError, ApiResponse } from './config';
import { Frequency } from './types';

interface FixedInvestmentInput {
  category_id: string;
  amount: number;
  frequency: Frequency;
  start_date: string;
  end_date?: string;
  expected_return_rate: number;
  investment_type: string;
  note?: string;
  is_active: boolean;
}

interface FixedInvestment extends FixedInvestmentInput {
  id: string;
  last_generated_date?: string;
}

export const fixedInvestmentsService = {
  getAll: async (): Promise<FixedInvestment[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FixedInvestment[]>>('/financial/fixed-investments');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<FixedInvestment> => {
    try {
      const response = await apiClient.get<ApiResponse<FixedInvestment>>(`/financial/fixed-investments/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (fixedInvestment: FixedInvestmentInput): Promise<FixedInvestment> => {
    try {
      const response = await apiClient.post<ApiResponse<FixedInvestment>>('/financial/fixed-investments', fixedInvestment);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, fixedInvestment: Partial<FixedInvestmentInput>): Promise<FixedInvestment> => {
    try {
      const response = await apiClient.put<ApiResponse<FixedInvestment>>(`/financial/fixed-investments/${id}`, fixedInvestment);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/financial/fixed-investments/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

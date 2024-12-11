import { apiClient, handleApiError, ApiResponse } from './config';
import { FinancialGoal, GoalStatus } from './types';

interface FinancialGoalInput {
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: GoalStatus;
}

export const financialGoalsService = {
  getAll: async (): Promise<FinancialGoal[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FinancialGoal[]>>('/financial/financial-goals');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.get<ApiResponse<FinancialGoal>>(`/financial/financial-goals/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (goal: FinancialGoalInput): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.post<ApiResponse<FinancialGoal>>('/financial/financial-goals', goal);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, goal: Partial<FinancialGoalInput>): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.put<ApiResponse<FinancialGoal>>(`/financial/financial-goals/${id}`, goal);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/financial/financial-goals/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

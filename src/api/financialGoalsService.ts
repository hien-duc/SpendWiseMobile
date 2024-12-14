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
  getAll: async (userId: string): Promise<FinancialGoal[]> => {
    try {
      const response = await apiClient.get<FinancialGoal[]>('/financial/financial-goals/', {
        params: { userId }
      });
      return response.data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string, userId: string): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.get<FinancialGoal>(`/financial/financial-goals/${id}/`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (goal: Partial<FinancialGoal>, userId: string): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.post<FinancialGoal>('/financial/financial-goals/', {
        ...goal,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, goal: Partial<FinancialGoal>, userId: string): Promise<FinancialGoal> => {
    try {
      const response = await apiClient.put<FinancialGoal>(`/financial/financial-goals/${id}/`, {
        ...goal,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string, userId: string): Promise<void> => {
    try {
      await apiClient.delete(`/financial/financial-goals/${id}/`, {
        params: { userId }
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

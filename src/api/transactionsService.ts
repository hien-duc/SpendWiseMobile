import { apiClient, handleApiError, ApiResponse } from './config';
import { Transaction, TransactionInput } from './types';

export const transactionsService = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Transaction[]>>('/transactions');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (transaction: TransactionInput): Promise<Transaction> => {
    try {
      const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', transaction);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, transaction: Partial<TransactionInput>): Promise<Transaction> => {
    try {
      const response = await apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, transaction);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  generateRecurring: async (): Promise<{ message: string; latest_transactions: Transaction[] }> => {
    try {
      const response = await apiClient.post<ApiResponse<{ 
        message: string; 
        latest_transactions: Transaction[] 
      }>>('/financial/generate-transactions');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

import { apiClient, handleApiError, ApiResponse } from './config';
import { Category, TransactionType } from './types';

interface CategoryInput {
  name: string;
  description?: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export const categoriesService = {
  getAll: async (type?: TransactionType): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
        params: { type }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  create: async (category: CategoryInput): Promise<Category> => {
    try {
      const response = await apiClient.post<ApiResponse<Category>>('/categories', category);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  update: async (id: string, category: Partial<CategoryInput>): Promise<Category> => {
    try {
      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, category);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

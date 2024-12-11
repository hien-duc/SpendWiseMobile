import { apiClient, handleApiError, ApiResponse } from './config';
import { Category, TransactionType } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
      console.log(`[CategoriesService] Fetching categories with type: ${type}`);
      
      // Get the current token for debugging
      const token = await AsyncStorage.getItem('token');
      console.log(`[CategoriesService] Current token: ${token}`);

      const response = await apiClient.get<Category[]>('/categories', {
        params: { type }
      });

      console.log(`[CategoriesService] Full API Response:`, JSON.stringify(response.data, null, 2));
      
      // Validate response 
      const categories = response.data;
      console.log(`[CategoriesService] Fetched categories count:`, categories ? categories.length : 'N/A');

      if (!categories || !Array.isArray(categories)) {
        console.error('[CategoriesService] Categories is not an array:', categories);
        throw new Error('Categories data is not in the expected format');
      }

      // Filter categories by type if specified
      const filteredCategories = type 
        ? categories.filter(category => category.type === type)
        : categories;

      console.log(`[CategoriesService] Filtered categories count:`, filteredCategories.length);

      return filteredCategories;
    } catch (error) {
      // More detailed error logging
      console.error('[CategoriesService] Error fetching categories:', error);
      
      // If it's an Axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('[CategoriesService] Axios Error Details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }

      throw handleApiError(error);
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      console.log(`[CategoriesService] Fetching category with id: ${id}`);

      // Get the current token for debugging
      const token = await AsyncStorage.getItem('token');
      console.log(`[CategoriesService] Current token: ${token}`);

      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);

      console.log(`[CategoriesService] Full API Response:`, JSON.stringify(response.data, null, 2));

      // Validate response structure
      if (!response || !response.data) {
        console.error('[CategoriesService] Invalid response structure');
        throw new Error('Invalid response from server');
      }

      // Validate data
      const category = response.data.data;
      console.log(`[CategoriesService] Fetched category:`, category);

      if (!category) {
        console.error('[CategoriesService] Category is null or undefined:', category);
        throw new Error('Category data is not in the expected format');
      }

      return category;
    } catch (error) {
      // More detailed error logging
      console.error('[CategoriesService] Error fetching category:', error);

      // If it's an Axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('[CategoriesService] Axios Error Details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }

      throw handleApiError(error);
    }
  },

  create: async (category: CategoryInput): Promise<Category> => {
    try {
      console.log(`[CategoriesService] Creating category:`, category);

      // Get the current token for debugging
      const token = await AsyncStorage.getItem('token');
      console.log(`[CategoriesService] Current token: ${token}`);

      const response = await apiClient.post<ApiResponse<Category>>('/categories', category);

      console.log(`[CategoriesService] Full API Response:`, JSON.stringify(response.data, null, 2));

      // Validate response structure
      if (!response || !response.data) {
        console.error('[CategoriesService] Invalid response structure');
        throw new Error('Invalid response from server');
      }

      // Validate data
      const createdCategory = response.data.data;
      console.log(`[CategoriesService] Created category:`, createdCategory);

      if (!createdCategory) {
        console.error('[CategoriesService] Created category is null or undefined:', createdCategory);
        throw new Error('Created category data is not in the expected format');
      }

      return createdCategory;
    } catch (error) {
      // More detailed error logging
      console.error('[CategoriesService] Error creating category:', error);

      // If it's an Axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('[CategoriesService] Axios Error Details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }

      throw handleApiError(error);
    }
  },

  update: async (id: string, category: Partial<CategoryInput>): Promise<Category> => {
    try {
      console.log(`[CategoriesService] Updating category with id: ${id}`, category);

      // Get the current token for debugging
      const token = await AsyncStorage.getItem('token');
      console.log(`[CategoriesService] Current token: ${token}`);

      const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, category);

      console.log(`[CategoriesService] Full API Response:`, JSON.stringify(response.data, null, 2));

      // Validate response structure
      if (!response || !response.data) {
        console.error('[CategoriesService] Invalid response structure');
        throw new Error('Invalid response from server');
      }

      // Validate data
      const updatedCategory = response.data.data;
      console.log(`[CategoriesService] Updated category:`, updatedCategory);

      if (!updatedCategory) {
        console.error('[CategoriesService] Updated category is null or undefined:', updatedCategory);
        throw new Error('Updated category data is not in the expected format');
      }

      return updatedCategory;
    } catch (error) {
      // More detailed error logging
      console.error('[CategoriesService] Error updating category:', error);

      // If it's an Axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('[CategoriesService] Axios Error Details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }

      throw handleApiError(error);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`[CategoriesService] Deleting category with id: ${id}`);

      // Get the current token for debugging
      const token = await AsyncStorage.getItem('token');
      console.log(`[CategoriesService] Current token: ${token}`);

      const response = await apiClient.delete(`/categories/${id}`);

      console.log(`[CategoriesService] Full API Response:`, JSON.stringify(response.data, null, 2));

      // Validate response structure
      if (!response || !response.data) {
        console.error('[CategoriesService] Invalid response structure');
        throw new Error('Invalid response from server');
      }

      console.log(`[CategoriesService] Category deleted successfully`);
    } catch (error) {
      // More detailed error logging
      console.error('[CategoriesService] Error deleting category:', error);

      // If it's an Axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('[CategoriesService] Axios Error Details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }

      throw handleApiError(error);
    }
  }
};

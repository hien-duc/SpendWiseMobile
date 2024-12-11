import { apiClient, handleApiError, ApiResponse } from './config';
import { MonthlyReport } from './types';

export const reportsService = {
  getMonthlyReport: async (month?: number, year?: number): Promise<MonthlyReport> => {
    try {
      const response = await apiClient.get<ApiResponse<MonthlyReport>>('/reports/monthly', {
        params: {
          month,
          year
        }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Add more report-related methods as needed
  getCategoryBreakdown: async (startDate: string, endDate: string): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/reports/category-breakdown', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTrends: async (period: 'weekly' | 'monthly' | 'yearly'): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/reports/trends', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

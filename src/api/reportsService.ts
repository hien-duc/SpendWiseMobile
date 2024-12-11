import { apiClient, handleApiError, ApiResponse } from './config';

export interface MonthlyReportData {
  total_income: number;
  total_expense: number;
  total_investment: number;
  total_net_balance: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: 'income' | 'expense' | 'investment';
  category_amount: number;
  category_percentage: number;
}

export const reportsService = {
  getMonthlyReport: async (month: number, year: number): Promise<MonthlyReportData[]> => {
    try {
      console.log('Sending request for:', { month, year });
      const response = await apiClient.get<MonthlyReportData[]>(`/reports/monthly/${year}/${month}`);
      console.log('Raw API Response:', response.data);
      
      if (!response.data) {
        console.log('No data in response');
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in getMonthlyReport:', error);
      throw handleApiError(error);
    }
  },

  getCategoryTrend: async (categoryId: string, year: number): Promise<any> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/reports/category-trend/${year}/${categoryId}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

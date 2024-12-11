import { apiClient, handleApiError, ApiResponse } from './config';

interface MonthlyReportData {
  total_income: number;
  total_expense: number;
  total_investment: number;
  net_balance: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: 'expense' | 'income' | 'investment';
  category_amount: number;
  category_percentage: number;
}

export const reportsService = {
  getMonthlyReport: async (month: number, year: number): Promise<MonthlyReportData[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MonthlyReportData[]>>(`/reports/monthly/${year}/${month}`);
      return response.data.data;
    } catch (error) {
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

import { apiClient, handleApiError, ApiResponse } from './config';

export interface MonthlyReportData {
  net_balance(net_balance: any): unknown;
  total_income: number;
  total_expense: number;
  total_investment: number;
  total_net_balance: number;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: 'income' | 'expense' | 'investment';
  category_amount: number;
  category_percentage: number;
}

export interface CategoryTrendData {
  month: number;
  month_name: string;
  amount: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_type: 'income' | 'expense' | 'investment';
  date_label: string;
  latest_transaction_date: string;
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

  getCategoryTrend: async (year: number, categoryId: string): Promise<CategoryTrendData[]> => {
    try {
      console.log('Fetching category trend for:', { year, categoryId });
      const response = await apiClient.get<CategoryTrendData[]>(`/reports/category-trend/${year}/${categoryId}`);
      console.log('Category trend response:', response.data);

      if (!response.data) {
        console.log('No trend data in response');
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error in getCategoryTrend:', error);
      throw handleApiError(error);
    }
  }
};

import { supabase } from '../../supabase';

interface AnnualTransactionsReport {
    month_number: number;
    month_name: string;
    income_amount: number;
    expense_amount: number;
    investment_amount: number;
    running_income_total: number;
    running_expense_total: number;
    running_investment_total: number;
    year_to_date_income_total: number;
    year_to_date_expense_total: number;
    year_to_date_investment_total: number;
}

interface CategorySummary {
    category_name: string;
    category_icon: string;
    category_color: string;
    total_amount: number;
    percentage: number;
    transaction_type: 'income' | 'expense' | 'investment';
}

interface AllTimeBalanceReport {
    year: number;
    month: number;
    month_name: string;
    income_amount: number;
    expense_amount: number;
    investment_amount: number;
    net_amount: number;
    initial_balance: number;
    cumulative_balance: number;
}

class OtherService {
    async getAnnualTransactionsReport(year: number): Promise<AnnualTransactionsReport[]> {
        const { data, error } = await supabase
            .rpc('get_annual_transactions_report', {
                year_param: year
            });

        if (error) {
            console.error('Error fetching annual transactions report:', error);
            throw error;
        }

        return data || [];
    }

    async getAnnualCategoriesSummary(year: number): Promise<CategorySummary[]> {
        const { data, error } = await supabase
            .rpc('get_annual_categories_summary', {
                year_param: year
            });

        if (error) {
            console.error('Error fetching annual categories summary:', error);
            throw error;
        }

        return data || [];
    }

    async getAllTimeBalanceReport(): Promise<AllTimeBalanceReport[]> {
        const { data, error } = await supabase
            .rpc('get_all_time_balance_report');

        if (error) {
            console.error('Error fetching all-time balance report:', error);
            throw error;
        }

        return data || [];
    }

    async getAllTimeCategoriesSummary(): Promise<CategorySummary[]> {
        const { data, error } = await supabase
            .rpc('get_all_time_categories_summary');

        if (error) {
            console.error('Error fetching all-time categories summary:', error);
            throw error;
        }

        return data || [];
    }
}

export const otherService = new OtherService();
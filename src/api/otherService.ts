import { API_URL } from '../config';
import { Session } from '@supabase/supabase-js';

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
    private getAuthHeaders(session: Session | null): HeadersInit {
        if (!session?.access_token) {
            throw new Error('Not authenticated');
        }

        return {
            'Authorization': `Bearer ${session.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    async getAnnualTransactionsReport(year: number, session: Session | null): Promise<AnnualTransactionsReport[]> {
        try {
            const headers = this.getAuthHeaders(session);
            console.log('Making request to:', `${API_URL}/api/other/annual-transactions/${year}`);
            console.log('With headers:', headers);

            const response = await fetch(`${API_URL}/api/other/annual-transactions/${year}`, {
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Failed to fetch annual transactions report: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching annual transactions report:', error);
            throw error;
        }
    }

    async getAnnualCategoriesSummary(year: number, session: Session | null): Promise<CategorySummary[]> {
        try {
            const headers = this.getAuthHeaders(session);
            console.log('Making request to:', `${API_URL}/api/other/annual-categories/${year}`);
            console.log('With headers:', headers);

            const response = await fetch(`${API_URL}/api/other/annual-categories/${year}`, {
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Failed to fetch annual categories summary: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching annual categories summary:', error);
            throw error;
        }
    }

    async getAnnualCategoriesReport(year: number, session: Session | null): Promise<CategorySummary[]> {
        try {
            console.log('Fetching annual categories for year:', year);
            const url = `${API_URL}/api/other/annual-categories/${year}`;
            console.log('Request URL:', url);
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getAuthHeaders(session)
            });

            console.log('Response Status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Annual categories response:', data);
            
            if (!data) {
                console.log('No annual categories data');
                return [];
            }
            
            return data;
        } catch (error) {
            console.error('Error in getAnnualCategoriesReport:', error);
            throw error;
        }
    }

    async getAllTimeBalanceReport(session: Session | null): Promise<AllTimeBalanceReport[]> {
        try {
            const headers = this.getAuthHeaders(session);
            console.log('Making request to:', `${API_URL}/api/other/all-time-balance`);
            console.log('With headers:', headers);

            const response = await fetch(`${API_URL}/api/other/all-time-balance`, {
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Failed to fetch all-time balance report: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching all-time balance report:', error);
            throw error;
        }
    }

    async getAllTimeCategoriesSummary(session: Session | null): Promise<CategorySummary[]> {
        try {
            const headers = this.getAuthHeaders(session);
            console.log('Making request to:', `${API_URL}/api/other/all-time-categories`);
            console.log('With headers:', headers);

            const response = await fetch(`${API_URL}/api/other/all-time-categories`, {
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`Failed to fetch all-time categories summary: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching all-time categories summary:', error);
            throw error;
        }
    }
}

export const otherService = new OtherService();
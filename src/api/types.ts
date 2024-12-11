// Common types
export type UUID = string;

// Transaction types
export type TransactionType = 'income' | 'expense' | 'investment';

export interface Transaction {
  id: UUID;
  category_id: UUID;
  amount: number;
  description: string;
  type: TransactionType;
  date: string;
  categories?: Category;
}

export interface TransactionInput {
  category_id: UUID;
  amount: number;
  description: string;
  type: TransactionType;
  date: string;
}

// Category types
export interface Category {
  id: UUID;
  name: string;
  description?: string;
  type: TransactionType;
  icon: string;
  color: string;
}

// Financial Goal types
export type GoalStatus = 'in_progress' | 'completed' | 'cancelled';

export interface FinancialGoal {
  id: UUID;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: GoalStatus;
}

// Fixed Cost types
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FixedCost {
  id: UUID;
  category_id: UUID;
  amount: number;
  frequency: Frequency;
  start_date: string;
  end_date?: string;
  note?: string;
  is_active: boolean;
  last_generated_date?: string;
}

// Report types
export interface MonthlyReport {
  total_income: number;
  total_expenses: number;
  total_investments: number;
  net_savings: number;
  categories_breakdown: {
    [key: string]: {
      amount: number;
      percentage: number;
    };
  };
}

// Profile types
export interface Profile {
  id: UUID;
  name: string;
  email: string;
  currency: string;
  initial_balance: number;
  theme_color?: string;
}

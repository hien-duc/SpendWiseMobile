-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum type for transaction types
create type transaction_type as enum ('expense', 'income', 'investment');

-- Profiles Table: Basic user information
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text,
    currency text default 'USD',
    initial_balance decimal(12,2) default 0.00
);


-- Categories Table: Transaction categories
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    type transaction_type not null,
    icon text not null,           -- Icon identifier for UI display
    color text not null,          -- Color identifier for UI display
    is_default boolean default false
);

-- Transactions Table: Financial transactions
create table public.transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    amount decimal(12,2) not null,
    note text,
    date date not null default current_date,
    type transaction_type not null
);

-- Create default categories for new users
create or replace function public.create_default_categories(user_id_param uuid)
returns void as $$
begin
    insert into public.categories (user_id, name, type, icon, color, is_default) values
    -- Expense categories
    (user_id_param, 'Food', 'expense', 'fastfood', '#FF5252', true),
    (user_id_param, 'Transportation', 'expense', 'directions_car', '#448AFF', true),
    (user_id_param, 'Houseware', 'expense', 'home_work', '#9C27B0', true),
    (user_id_param, 'Bills', 'expense', 'payments', '#FF9800', true),
    (user_id_param, 'Shopping', 'expense', 'shopping_bag', '#E91E63', true),
    -- Income categories
    (user_id_param, 'Salary', 'income', 'universal_currency_alt', '#4CAF50', true),
    (user_id_param, 'Freelance', 'income', 'person_apron', '#8BC34A', true),
    (user_id_param, 'Bonus', 'income', 'bonus', '#CDDC39', true),
    -- Investment categories
    (user_id_param, 'Stocks', 'investment', 'inventory_2', '#795548', true),
    (user_id_param, 'Real Estate', 'investment', 'domain', '#607D8B', true),
    (user_id_param, 'Crypto', 'investment', 'currency_bitcoin', '#9E9E9E', true);
end;
$$ language plpgsql;

-- Handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, email)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', ''),
        new.email
    );
    perform public.create_default_categories(new.id);
    return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Get monthly calendar data with transactions and totals
CREATE OR REPLACE FUNCTION get_monthly_calendar_data(
    user_id_param UUID,
    year_param INTEGER,
    month_param INTEGER
)
RETURNS TABLE (
    -- Transaction details
    transaction_id UUID,
    transaction_date DATE,
    category_id UUID,
    category_name TEXT,
    category_icon TEXT,
    category_color TEXT,
    amount DECIMAL(12,2),
    transaction_type transaction_type,
    note TEXT,
    -- Monthly totals
    month_total_income DECIMAL(12,2),
    month_total_expense DECIMAL(12,2),
    month_total_investment DECIMAL(12,2),
    month_net_balance DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH monthly_totals AS (
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0.00) as total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0.00) as total_expense,
            COALESCE(SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END), 0.00) as total_investment,
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount 
                           WHEN type IN ('expense', 'investment') THEN -amount 
                           ELSE 0 END), 0.00) as net_balance
        FROM transactions
        WHERE user_id = user_id_param
        AND EXTRACT(year FROM date) = year_param
        AND EXTRACT(month FROM date) = month_param
    )
    SELECT 
        t.id as transaction_id,
        t.date as transaction_date,
        c.id as category_id,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        t.amount,
        t.type as transaction_type,
        t.note,
        mt.total_income as month_total_income,
        mt.total_expense as month_total_expense,
        mt.total_investment as month_total_investment,
        mt.net_balance as month_net_balance
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    CROSS JOIN monthly_totals mt
    WHERE t.user_id = user_id_param
    AND EXTRACT(year FROM t.date) = year_param
    AND EXTRACT(month FROM t.date) = month_param
    ORDER BY t.date DESC, t.id DESC;
END;
$$ LANGUAGE plpgsql;


-- Get monthly report data with category breakdowns and totals
CREATE OR REPLACE FUNCTION get_monthly_report_data(
    user_id_param UUID,
    year_param INTEGER,
    month_param INTEGER
)
RETURNS TABLE (
    -- Monthly totals
    total_income DECIMAL(12,2),
    total_expense DECIMAL(12,2),
    total_investment DECIMAL(12,2),
    net_balance DECIMAL(12,2),
    -- Category breakdown
    category_name TEXT,
    category_icon TEXT,
    category_color TEXT,
    category_type transaction_type,
    category_amount DECIMAL(12,2),
    category_percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH monthly_totals AS (
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0.00) as income_total,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0.00) as expense_total,
            COALESCE(SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END), 0.00) as investment_total,
            COALESCE(SUM(CASE 
                WHEN type = 'income' THEN amount 
                WHEN type IN ('expense', 'investment') THEN -amount 
                ELSE 0 END), 0.00) as net_balance
        FROM transactions
        WHERE user_id = user_id_param
        AND EXTRACT(year FROM date) = year_param
        AND EXTRACT(month FROM date) = month_param
    ),
    category_totals AS (
        SELECT 
            c.name,
            c.icon,
            c.color,
            c.type,
            COALESCE(SUM(t.amount), 0.00) as amount,
            SUM(SUM(COALESCE(t.amount, 0))) OVER (PARTITION BY c.type) as type_total
        FROM categories c
        LEFT JOIN transactions t ON 
            t.category_id = c.id 
            AND t.user_id = user_id_param
            AND EXTRACT(year FROM t.date) = year_param
            AND EXTRACT(month FROM t.date) = month_param
        WHERE c.user_id = user_id_param
        GROUP BY c.id, c.name, c.icon, c.color, c.type
    )
    SELECT 
        mt.income_total,
        mt.expense_total,
        mt.investment_total,
        mt.net_balance,
        ct.name,
        ct.icon,
        ct.color,
        ct.type,
        ct.amount,
        CASE 
            WHEN ct.type_total > 0 THEN ROUND((ct.amount / ct.type_total * 100)::numeric, 2)
            ELSE 0.00
        END as percentage
    FROM monthly_totals mt
    CROSS JOIN category_totals ct
    WHERE ct.amount > 0  -- Only show categories with transactions
    ORDER BY ct.type, ct.amount DESC;
END;
$$ LANGUAGE plpgsql;



-- Get category trend data for detail view
CREATE OR REPLACE FUNCTION get_category_trend_detail(
    user_id_param UUID,
    year_param INTEGER,
    category_id_param UUID
)
RETURNS TABLE (
    month INTEGER,
    month_name TEXT,
    amount DECIMAL(12,2),
    category_name TEXT,
    category_icon TEXT,
    category_color TEXT,
    category_type transaction_type,
    date_label TEXT,  -- For displaying dates like "12.7 2024 (Sat)"
    latest_transaction_date DATE
) AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT generate_series(1, 12) as month_number
    ),
    category_info AS (
        SELECT 
            name,
            icon,
            color,
            type
        FROM categories
        WHERE id = category_id_param
        AND user_id = user_id_param
    ),
    latest_date AS (
        SELECT MAX(date) as last_date
        FROM transactions
        WHERE category_id = category_id_param
        AND user_id = user_id_param
        AND EXTRACT(year FROM date) = year_param
    )
    SELECT 
        m.month_number as month,
        to_char(to_date(m.month_number::text, 'MM'), 'Month') as month_name,
        COALESCE(SUM(t.amount), 0.00) as amount,
        ci.name as category_name,
        ci.icon as category_icon,
        ci.color as category_color,
        ci.type as category_type,
        CASE 
            WHEN m.month_number = EXTRACT(month FROM ld.last_date)
            THEN to_char(ld.last_date, 'DD.MM YYYY (Dy)')
            ELSE ''
        END as date_label,
        ld.last_date as latest_transaction_date
    FROM months m
    CROSS JOIN category_info ci
    CROSS JOIN latest_date ld
    LEFT JOIN transactions t ON 
        EXTRACT(month FROM t.date) = m.month_number
        AND EXTRACT(year FROM t.date) = year_param
        AND t.category_id = category_id_param
        AND t.user_id = user_id_param
    WHERE m.month_number <= EXTRACT(month FROM CURRENT_DATE)
        OR year_param < EXTRACT(year FROM CURRENT_DATE)
    GROUP BY 
        m.month_number,
        ci.name,
        ci.icon,
        ci.color,
        ci.type,
        ld.last_date
    ORDER BY m.month_number;
END;
$$ LANGUAGE plpgsql;




-- Get annual income report with monthly breakdown and total
create or replace function get_annual_transactions_report(
    user_id_param uuid,
    year_param integer
)
returns table (
    month_number integer,
    month_name text,
    income_amount decimal(12,2),
    expense_amount decimal(12,2),
    investment_amount decimal(12,2),
    running_income_total decimal(12,2),
    running_expense_total decimal(12,2),
    running_investment_total decimal(12,2),
    year_to_date_income_total decimal(12,2),
    year_to_date_expense_total decimal(12,2),
    year_to_date_investment_total decimal(12,2)
) as $$
begin
    return query
    with months as (
        select generate_series(1, 12) as month_num
    ),
    monthly_data as (
        select 
            extract(month from date)::integer as month_num,
            sum(case when type = 'income' then amount else 0 end) as income,
            sum(case when type = 'expense' then amount else 0 end) as expense,
            sum(case when type = 'investment' then amount else 0 end) as investment
        from transactions
        where user_id = user_id_param
        and extract(year from date) = year_param
        group by extract(month from date)
    ),
    year_to_date as (
        select 
            coalesce(sum(case when type = 'income' then amount else 0 end), 0.00) as income_total,
            coalesce(sum(case when type = 'expense' then amount else 0 end), 0.00) as expense_total,
            coalesce(sum(case when type = 'investment' then amount else 0 end), 0.00) as investment_total
        from transactions
        where user_id = user_id_param
        and extract(year from date) = year_param
    )
    select 
        m.month_num as month_number,
        to_char(to_date(m.month_num::text, 'MM'), 'Month') as month_name,
        coalesce(md.income, 0.00) as income_amount,
        coalesce(md.expense, 0.00) as expense_amount,
        coalesce(md.investment, 0.00) as investment_amount,
        sum(coalesce(md.income, 0.00)) over (order by m.month_num) as running_income_total,
        sum(coalesce(md.expense, 0.00)) over (order by m.month_num) as running_expense_total,
        sum(coalesce(md.investment, 0.00)) over (order by m.month_num) as running_investment_total,
        (select income_total from year_to_date) as year_to_date_income_total,
        (select expense_total from year_to_date) as year_to_date_expense_total,
        (select investment_total from year_to_date) as year_to_date_investment_total
    from months m
    left join monthly_data md on md.month_num = m.month_num
    where m.month_num <= extract(month from current_date)
        or year_param < extract(year from current_date)
    order by m.month_num;
end;
$$ language plpgsql;



-- Get annual transaction trends with total (combined function)
-- anual report
CREATE OR REPLACE FUNCTION get_annual_transactions_trend(
    user_id_param UUID,
    year_param INTEGER
)
RETURNS TABLE (
    year_number INTEGER,
    month_number INTEGER,
    month_name TEXT,
    income_amount DECIMAL(12,2),
    income_running_total DECIMAL(12,2),
    income_year_total DECIMAL(12,2),
    expense_amount DECIMAL(12,2),
    expense_running_total DECIMAL(12,2),
    expense_year_total DECIMAL(12,2),
    investment_amount DECIMAL(12,2),
    investment_running_total DECIMAL(12,2),
    investment_year_total DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT generate_series(1, 12) AS month_num
    ),
    yearly_totals AS (
        SELECT 
            type,
            COALESCE(SUM(amount), 0.00) AS total
        FROM transactions
        WHERE user_id = user_id_param
        AND EXTRACT(year FROM date) = year_param
        GROUP BY type
    ),
    monthly_amounts AS (
        SELECT 
            EXTRACT(month FROM t.date)::integer AS month_num,
            t.type,
            COALESCE(SUM(t.amount), 0.00) AS amount
        FROM transactions t
        WHERE t.user_id = user_id_param
        AND EXTRACT(year FROM t.date) = year_param
        GROUP BY EXTRACT(month FROM t.date), t.type
    ),
    running_totals AS (
        SELECT 
            m.month_num,
            to_char(to_date(m.month_num::text, 'MM'), 'Month') AS month_name,
            -- Income
            COALESCE(MAX(CASE WHEN ma.type = 'income' THEN ma.amount ELSE 0 END), 0.00) AS income_amount,
            SUM(COALESCE(CASE WHEN ma.type = 'income' THEN ma.amount ELSE 0 END, 0.00)) 
                OVER (ORDER BY m.month_num) AS income_running_total,
            COALESCE(MAX(CASE WHEN yt.type = 'income' THEN yt.total ELSE 0 END), 0.00) AS income_year_total,
            -- Expense
            COALESCE(MAX(CASE WHEN ma.type = 'expense' THEN ma.amount ELSE 0 END), 0.00) AS expense_amount,
            SUM(COALESCE(CASE WHEN ma.type = 'expense' THEN ma.amount ELSE 0 END, 0.00)) 
                OVER (ORDER BY m.month_num) AS expense_running_total,
            COALESCE(MAX(CASE WHEN yt.type = 'expense' THEN yt.total ELSE 0 END), 0.00) AS expense_year_total,
            -- Investment
            COALESCE(MAX(CASE WHEN ma.type = 'investment' THEN ma.amount ELSE 0 END), 0.00) AS investment_amount,
            SUM(COALESCE(CASE WHEN ma.type = 'investment' THEN ma.amount ELSE 0 END, 0.00)) 
                OVER (ORDER BY m.month_num) AS investment_running_total,
            COALESCE(MAX(CASE WHEN yt.type = 'investment' THEN yt.total ELSE 0 END), 0.00) AS investment_year_total
        FROM months m
        LEFT JOIN monthly_amounts ma ON ma.month_num = m.month_num
        CROSS JOIN yearly_totals yt
        GROUP BY m.month_num
    )
    SELECT 
        year_param AS year_number,
        month_num AS month_number,
        month_name,
        income_amount,
        income_running_total,
        income_year_total,
        expense_amount,
        expense_running_total,
        expense_year_total,
        investment_amount,
        investment_running_total,
        investment_year_total
    FROM running_totals
    ORDER BY month_number;
END;
$$ LANGUAGE plpgsql;





-- Get all-time financial report with initial balance
-- all time report
create or replace function get_all_time_balance_report(
    user_id_param uuid
)
returns table (
    year integer,
    month integer,
    month_name text,
    income_amount decimal(12,2),
    expense_amount decimal(12,2),
    investment_amount decimal(12,2),
    net_amount decimal(12,2),
    initial_balance decimal(12,2),
    cumulative_balance decimal(12,2)
) as $$
begin
    return query
    with monthly_transactions as (
        select 
            extract(year from date)::integer as year,
            extract(month from date)::integer as month,
            sum(case when type = 'income' then amount else 0 end) as income,
            sum(case when type = 'expense' then amount else 0 end) as expense,
            sum(case when type = 'investment' then amount else 0 end) as investment
        from transactions
        where user_id = user_id_param
        group by extract(year from date), extract(month from date)
    ),
    initial_bal as (
        select coalesce(initial_balance, 0.00) as balance
        from profiles
        where user_id = user_id_param
    )
    select 
        mt.year,
        mt.month,
        to_char(to_date(mt.month::text, 'MM'), 'Month') as month_name,
        coalesce(mt.income, 0.00) as income_amount,
        coalesce(mt.expense, 0.00) as expense_amount,
        coalesce(mt.investment, 0.00) as investment_amount,
        (coalesce(mt.income, 0.00) - coalesce(mt.expense, 0.00) - coalesce(mt.investment, 0.00)) as net_amount,
        (select balance from initial_bal) as initial_balance,
        (select balance from initial_bal) + 
        sum(coalesce(mt.income, 0.00) - coalesce(mt.expense, 0.00) - coalesce(mt.investment, 0.00)) 
        over (order by mt.year, mt.month) as cumulative_balance
    from monthly_transactions mt
    order by mt.year, mt.month;
end;
$$ language plpgsql;

        400.00 |          100.00 |     300.00 |         1000.00 |           2100.00


-- Get all-time transactions by categories report
-- Combined all-time category analysis function
-- all time category report
CREATE OR REPLACE FUNCTION get_all_time_categories_summary(
    user_id UUID
)
RETURNS TABLE (
    category_name TEXT,
    category_icon TEXT,
    category_color TEXT,
    total_amount DECIMAL(12,2),
    percentage DECIMAL(5,2),
    transaction_type transaction_type
) AS $$
BEGIN
    RETURN QUERY
    WITH category_totals AS (
        SELECT 
            c.name,
            c.icon,
            c.color,
            COALESCE(SUM(t.amount), 0) as total,
            c.type as trans_type
        FROM categories c
        LEFT JOIN transactions t ON 
            t.category_id = c.id AND
            t.user_id = user_id
        WHERE c.user_id = user_id
        GROUP BY c.id, c.name, c.icon, c.color, c.type
    ),
    type_totals AS (
        SELECT 
            trans_type,
            SUM(total) as type_total
        FROM category_totals
        GROUP BY trans_type
    )
    SELECT 
        ct.name,
        ct.icon,
        ct.color,
        ct.total,
        CASE 
            WHEN tt.type_total = 0 THEN 0
            ELSE ROUND((ct.total / tt.type_total * 100)::numeric, 2)
        END,
        ct.trans_type
    FROM category_totals ct
    JOIN type_totals tt ON ct.trans_type = tt.trans_type
    ORDER BY ct.trans_type, ct.total DESC;
END;
$$ LANGUAGE plpgsql;


-- Get annual transactions by categories report (combined function)
-- category annual  report
CREATE OR REPLACE FUNCTION get_annual_categories_summary(
    user_id_param UUID,
    year_param INTEGER
)
RETURNS TABLE (
    category_name TEXT,
    category_icon TEXT,
    category_color TEXT,
    total_amount DECIMAL(12,2),
    percentage DECIMAL(5,2),
    transaction_type transaction_type
) AS $$
BEGIN
    RETURN QUERY
    WITH category_totals AS (
        SELECT 
            c.name,
            c.icon,
            c.color,
            COALESCE(SUM(t.amount), 0) as total,
            c.type as trans_type
        FROM categories c
        LEFT JOIN transactions t ON 
            t.category_id = c.id AND
            t.user_id = user_id_param AND
            EXTRACT(YEAR FROM t.date) = year_param
        WHERE c.user_id = user_id_param
        GROUP BY c.id, c.name, c.icon, c.color, c.type
    ),
    type_totals AS (
        SELECT 
            trans_type,
            SUM(total) as type_total
        FROM category_totals
        GROUP BY trans_type
    )
    SELECT 
        ct.name,
        ct.icon,
        ct.color,
        ct.total,
        CASE 
            WHEN tt.type_total = 0 THEN 0
            ELSE ROUND((ct.total / tt.type_total * 100)::numeric, 2)
        END,
        ct.trans_type
    FROM category_totals ct
    JOIN type_totals tt ON ct.trans_type = tt.trans_type
    ORDER BY ct.trans_type, ct.total DESC;
END;
$$ LANGUAGE plpgsql;





CREATE TABLE public.financial_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    deadline DATE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
);


-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON public.financial_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_status ON public.financial_goals(status);

-- fixed income functions
-- Create enum type for frequency
CREATE TYPE frequency_type AS ENUM (
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'annually'
);

-- Fixed Costs Table
CREATE TABLE public.fixed_costs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    amount decimal(12,2) NOT NULL,
    frequency frequency_type NOT NULL,
    start_date date NOT NULL,
    end_date date,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    last_generated_date date
);

-- Periodic Income Table
CREATE TABLE public.periodic_income (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    amount decimal(12,2) NOT NULL,
    frequency frequency_type NOT NULL,
    start_date date NOT NULL,
    end_date date,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    last_generated_date date
);

-- Fixed Investments Table
CREATE TABLE public.fixed_investments (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    amount decimal(12,2) NOT NULL,
    frequency frequency_type NOT NULL,
    start_date date NOT NULL,
    end_date date,
    expected_return_rate decimal(5,2),
    investment_type text NOT NULL,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    last_generated_date date
);

-- Function to generate transactions from fixed costs
CREATE OR REPLACE FUNCTION generate_fixed_cost_transactions()
RETURNS void AS $$
DECLARE
    fixed_cost RECORD;
    next_date DATE;
BEGIN
    FOR fixed_cost IN 
        SELECT * FROM fixed_costs 
        WHERE is_active = true 
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    LOOP
        -- Calculate next date based on last generated date or start date
        next_date := COALESCE(fixed_cost.last_generated_date, fixed_cost.start_date);
        
        WHILE next_date <= CURRENT_DATE AND (fixed_cost.end_date IS NULL OR next_date <= fixed_cost.end_date) LOOP
            -- Insert transaction
            INSERT INTO transactions (
                user_id,
                category_id,
                amount,
                note,
                date,
                type
            ) VALUES (
                fixed_cost.user_id,
                fixed_cost.category_id,
                fixed_cost.amount,
                COALESCE(fixed_cost.note, 'Auto-generated fixed cost'),
                next_date,
                'expense'
            );

            -- Calculate next date based on frequency
            next_date := CASE fixed_cost.frequency
                WHEN 'daily' THEN next_date + INTERVAL '1 day'
                WHEN 'weekly' THEN next_date + INTERVAL '1 week'
                WHEN 'biweekly' THEN next_date + INTERVAL '2 weeks'
                WHEN 'monthly' THEN next_date + INTERVAL '1 month'
                WHEN 'quarterly' THEN next_date + INTERVAL '3 months'
                WHEN 'annually' THEN next_date + INTERVAL '1 year'
            END;
        END LOOP;

        -- Update last generated date
        UPDATE fixed_costs 
        SET last_generated_date = CURRENT_DATE
        WHERE id = fixed_cost.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate transactions from periodic income
CREATE OR REPLACE FUNCTION generate_periodic_income_transactions()
RETURNS void AS $$
DECLARE
    periodic_inc RECORD;
    next_date DATE;
BEGIN
    FOR periodic_inc IN 
        SELECT * FROM periodic_income 
        WHERE is_active = true 
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    LOOP
        -- Calculate next date based on last generated date or start date
        next_date := COALESCE(periodic_inc.last_generated_date, periodic_inc.start_date);
        
        WHILE next_date <= CURRENT_DATE AND (periodic_inc.end_date IS NULL OR next_date <= periodic_inc.end_date) LOOP
            -- Insert transaction
            INSERT INTO transactions (
                user_id,
                category_id,
                amount,
                note,
                date,
                type
            ) VALUES (
                periodic_inc.user_id,
                periodic_inc.category_id,
                periodic_inc.amount,
                COALESCE(periodic_inc.note, 'Auto-generated periodic income'),
                next_date,
                'income'
            );

            -- Calculate next date based on frequency
            next_date := CASE periodic_inc.frequency
                WHEN 'daily' THEN next_date + INTERVAL '1 day'
                WHEN 'weekly' THEN next_date + INTERVAL '1 week'
                WHEN 'biweekly' THEN next_date + INTERVAL '2 weeks'
                WHEN 'monthly' THEN next_date + INTERVAL '1 month'
                WHEN 'quarterly' THEN next_date + INTERVAL '3 months'
                WHEN 'annually' THEN next_date + INTERVAL '1 year'
            END;
        END LOOP;

        -- Update last generated date
        UPDATE periodic_income 
        SET last_generated_date = CURRENT_DATE
        WHERE id = periodic_inc.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate transactions from fixed investments
CREATE OR REPLACE FUNCTION generate_fixed_investment_transactions()
RETURNS void AS $$
DECLARE
    fixed_inv RECORD;
    next_date DATE;
    return_amount DECIMAL(12,2);
BEGIN
    FOR fixed_inv IN 
        SELECT * FROM fixed_investments 
        WHERE is_active = true 
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    LOOP
        -- Calculate next date based on last generated date or start date
        next_date := COALESCE(fixed_inv.last_generated_date, fixed_inv.start_date);
        
        WHILE next_date <= CURRENT_DATE AND (fixed_inv.end_date IS NULL OR next_date <= fixed_inv.end_date) LOOP
            -- Calculate return amount if expected_return_rate is set
            return_amount := fixed_inv.amount;
            IF fixed_inv.expected_return_rate IS NOT NULL THEN
                return_amount := fixed_inv.amount * (1 + fixed_inv.expected_return_rate / 100.0);
            END IF;

            -- Insert investment transaction
            INSERT INTO transactions (
                user_id,
                category_id,
                amount,
                note,
                date,
                type
            ) VALUES (
                fixed_inv.user_id,
                fixed_inv.category_id,
                return_amount,
                COALESCE(fixed_inv.note, 'Auto-generated investment: ' || fixed_inv.investment_type),
                next_date,
                'investment'
            );

            -- Calculate next date based on frequency
            next_date := CASE fixed_inv.frequency
                WHEN 'daily' THEN next_date + INTERVAL '1 day'
                WHEN 'weekly' THEN next_date + INTERVAL '1 week'
                WHEN 'biweekly' THEN next_date + INTERVAL '2 weeks'
                WHEN 'monthly' THEN next_date + INTERVAL '1 month'
                WHEN 'quarterly' THEN next_date + INTERVAL '3 months'
                WHEN 'annually' THEN next_date + INTERVAL '1 year'
            END;
        END LOOP;

        -- Update last generated date
        UPDATE fixed_investments 
        SET last_generated_date = CURRENT_DATE
        WHERE id = fixed_inv.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to schedule the generation of transactions
CREATE OR REPLACE FUNCTION schedule_recurring_transactions()
RETURNS void AS $$
BEGIN
    PERFORM generate_fixed_cost_transactions();
    PERFORM generate_periodic_income_transactions();
    PERFORM generate_fixed_investment_transactions();
END;
$$ LANGUAGE plpgsql;

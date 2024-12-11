const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get monthly report with category breakdown
router.get('/monthly', auth, async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM get_monthly_report_data($1, $2, $3)',
            [userId, year, month]
        );

        // Transform the data to match the client's expected format
        const reportData = result.rows;
        
        // Get the first row for totals (they're the same for all rows)
        const totals = reportData.length > 0 ? {
            totalIncome: reportData[0].total_income,
            totalExpense: reportData[0].total_expense,
            totalInvestment: reportData[0].total_investment,
            netBalance: reportData[0].net_balance
        } : {
            totalIncome: 0,
            totalExpense: 0,
            totalInvestment: 0,
            netBalance: 0
        };

        // Transform category breakdown data
        const categoryBreakdown = reportData.map(row => ({
            categoryName: row.category_name,
            categoryIcon: row.category_icon,
            categoryColor: row.category_color,
            categoryType: row.category_type,
            categoryAmount: row.category_amount,
            categoryPercentage: row.category_percentage
        }));

        res.json({
            success: true,
            data: {
                monthlyTotals: totals,
                categoryBreakdown
            }
        });
    } catch (error) {
        console.error('Error in monthly report:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch monthly report data'
        });
    }
});

// Get category trend data
router.get('/category-trend', auth, async (req, res) => {
    try {
        const { category_id, start_date, end_date } = req.query;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 
                date_trunc('day', date) as transaction_date,
                SUM(amount) as daily_total
            FROM transactions
            WHERE user_id = $1
            AND category_id = $2
            AND date BETWEEN $3 AND $4
            GROUP BY date_trunc('day', date)
            ORDER BY transaction_date`,
            [userId, category_id, start_date, end_date]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error in category trend:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch category trend data'
        });
    }
});

module.exports = router;
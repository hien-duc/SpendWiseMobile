const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');
const { body, validationResult } = require('express-validator');

/**
 * @swagger
 * tags:
 *   name: Financial Goals
 *   description: Financial goals management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialGoal:
 *       type: object
 *       required:
 *         - name
 *         - target_amount
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: User ID from auth
 *         name:
 *           type: string
 *           description: Goal name
 *         target_amount:
 *           type: number
 *           format: float
 *           description: Target amount to achieve
 *         current_amount:
 *           type: number
 *           format: float
 *           description: Current progress amount
 *           default: 0
 *         deadline:
 *           type: string
 *           format: date
 *           description: Target date to achieve the goal
 *         status:
 *           type: string
 *           enum: [in_progress, completed, cancelled]
 *           default: in_progress
 */

// Validation middleware
const validateGoal = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
    body('target_amount')
        .isFloat({ min: 0.01 })
        .withMessage('Target amount must be greater than 0'),
    body('current_amount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Current amount must be 0 or greater'),
    body('deadline')
        .optional()
        .isISO8601()
        .withMessage('Deadline must be a valid date'),
    body('status')
        .optional()
        .isIn(['in_progress', 'completed', 'cancelled'])
        .withMessage('Invalid status')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * @swagger
 * /api/financial/financial-goals:
 *   get:
 *     summary: Get all financial goals for the authenticated user
 *     tags: [Financial Goals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of financial goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialGoal'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('financial_goals')
            .select('*')
            .eq('user_id', userId)
            .order('deadline', { ascending: true });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/financial/financial-goals/{id}:
 *   get:
 *     summary: Get a specific financial goal by ID
 *     tags: [Financial Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Financial goal ID
 *     responses:
 *       200:
 *         description: Financial goal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinancialGoal'
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('financial_goals')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Financial goal not found' });
            }
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching goal:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/financial/financial-goals:
 *   post:
 *     summary: Create a new financial goal
 *     tags: [Financial Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinancialGoal'
 *     responses:
 *       201:
 *         description: Financial goal created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', validateGoal, handleValidationErrors, async (req, res) => {
    try {
        const { name, target_amount, current_amount = 0, deadline, status = 'in_progress', user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('financial_goals')
            .insert([
                {
                    user_id,
                    name,
                    target_amount,
                    current_amount,
                    deadline,
                    status,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/financial/financial-goals/{id}:
 *   put:
 *     summary: Update a financial goal
 *     tags: [Financial Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinancialGoal'
 *     responses:
 *       200:
 *         description: Financial goal updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */
router.put('/:id', validateGoal, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, target_amount, current_amount, deadline, status, user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('financial_goals')
            .update({
                name,
                target_amount,
                current_amount,
                deadline,
                status,
            })
            .eq('id', id)
            .eq('user_id', user_id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/financial/financial-goals/{id}:
 *   delete:
 *     summary: Delete a financial goal
 *     tags: [Financial Goals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial goal deleted successfully
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { error } = await supabase
            .from('financial_goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
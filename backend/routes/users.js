const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: users.length,
            users: users.map((u) => u.toJSON())
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (own profile or admin)
router.get('/:id', async (req, res) => {
    try {
        // Users can only get their own profile unless admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this user'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user'
        });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (own profile or admin)
router.put(
    '/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Please provide a valid email'),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: errors.array()[0].msg
                });
            }

            // Users can only update their own profile unless admin
            if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this user'
                });
            }

            const user = await User.findById(req.params.id).select('+password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Only allow certain fields to be updated
            const { name, email, password } = req.body;
            if (name) user.name = name;
            if (email) user.email = email;
            if (password) user.password = password;

            // Non-admin users cannot change their own role
            if (req.body.role && req.user.role === 'admin') {
                user.role = req.body.role;
            }

            await user.save();

            res.json({
                success: true,
                user: user.toJSON()
            });
        } catch (error) {
            console.error('Update user error:', error);
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Server error updating user'
            });
        }
    }
);

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Certification = require('../models/Certification');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/certifications
// @desc    Get certifications (admin gets all, user gets own)
// @access  Private
router.get('/', async (req, res) => {
    try {
        let query = {};

        // If user is not admin, only return their own certifications
        if (req.user.role !== 'admin') {
            query.userId = req.user._id;
        }

        // Optional: filter by userId query param (admin only)
        if (req.query.userId && req.user.role === 'admin') {
            query.userId = req.query.userId;
        }

        // If a regular user passes their own userId as query param, allow it
        if (req.query.userId && req.user.role !== 'admin') {
            if (req.query.userId !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view other users\' certifications'
                });
            }
            query.userId = req.user._id;
        }

        const certifications = await Certification.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({
            success: true,
            count: certifications.length,
            certifications: certifications.map((c) => c.toJSON())
        });
    } catch (error) {
        console.error('Get certifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching certifications'
        });
    }
});

// @route   GET /api/certifications/:id
// @desc    Get a single certification
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const certification = await Certification.findById(req.params.id)
            .populate('userId', 'name email');

        if (!certification) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found'
            });
        }

        // Users can only view their own certifications
        if (
            req.user.role !== 'admin' &&
            certification.userId._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this certification'
            });
        }

        res.json({
            success: true,
            certification: certification.toJSON()
        });
    } catch (error) {
        console.error('Get certification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching certification'
        });
    }
});

// @route   POST /api/certifications
// @desc    Add a new certification
// @access  Private
router.post(
    '/',
    [
        body('certName').trim().notEmpty().withMessage('Certification name is required'),
        body('issuer').trim().notEmpty().withMessage('Issuer is required'),
        body('issueDate').notEmpty().withMessage('Issue date is required'),
        body('expiryDate').notEmpty().withMessage('Expiry date is required')
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

            const { certName, issuer, issueDate, expiryDate, certUrl } = req.body;

            // Determine userId: admin can add for other users, regular user adds for themselves
            let userId = req.user._id;
            if (req.body.userId && req.user.role === 'admin') {
                userId = req.body.userId;
            }

            // Determine status based on expiry date
            const status = new Date(expiryDate) < new Date() ? 'expired' : 'active';

            const certification = await Certification.create({
                userId,
                certName,
                issuer,
                issueDate: new Date(issueDate),
                expiryDate: new Date(expiryDate),
                certUrl: certUrl || '',
                status
            });

            res.status(201).json({
                success: true,
                certification: certification.toJSON()
            });
        } catch (error) {
            console.error('Add certification error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error adding certification'
            });
        }
    }
);

// @route   PUT /api/certifications/:id
// @desc    Update a certification
// @access  Private
router.put(
    '/:id',
    [
        body('certName').optional().trim().notEmpty().withMessage('Certification name cannot be empty'),
        body('issuer').optional().trim().notEmpty().withMessage('Issuer cannot be empty')
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

            const certification = await Certification.findById(req.params.id);
            if (!certification) {
                return res.status(404).json({
                    success: false,
                    message: 'Certification not found'
                });
            }

            // Users can only update their own certifications
            if (
                req.user.role !== 'admin' &&
                certification.userId.toString() !== req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this certification'
                });
            }

            // Update allowed fields
            const allowedFields = ['certName', 'issuer', 'issueDate', 'expiryDate', 'certUrl', 'status'];
            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    if (field === 'issueDate' || field === 'expiryDate') {
                        certification[field] = new Date(req.body[field]);
                    } else {
                        certification[field] = req.body[field];
                    }
                }
            });

            await certification.save();

            res.json({
                success: true,
                certification: certification.toJSON()
            });
        } catch (error) {
            console.error('Update certification error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error updating certification'
            });
        }
    }
);

// @route   DELETE /api/certifications/:id
// @desc    Delete a certification
// @access  Private (own cert or admin)
router.delete('/:id', async (req, res) => {
    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found'
            });
        }

        // Users can only delete their own certifications
        if (
            req.user.role !== 'admin' &&
            certification.userId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this certification'
            });
        }

        await Certification.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Certification deleted successfully'
        });
    } catch (error) {
        console.error('Delete certification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting certification'
        });
    }
});

module.exports = router;

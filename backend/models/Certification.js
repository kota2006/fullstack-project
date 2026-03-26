const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        certName: {
            type: String,
            required: [true, 'Certification name is required'],
            trim: true,
            maxlength: [200, 'Certification name cannot exceed 200 characters']
        },
        issuer: {
            type: String,
            required: [true, 'Issuer is required'],
            trim: true,
            maxlength: [200, 'Issuer name cannot exceed 200 characters']
        },
        issueDate: {
            type: Date,
            required: [true, 'Issue date is required']
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required']
        },
        certUrl: {
            type: String,
            trim: true,
            default: ''
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'revoked'],
            default: 'active'
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                // Format dates as YYYY-MM-DD strings for frontend compatibility
                if (ret.issueDate) ret.issueDate = ret.issueDate.toISOString().split('T')[0];
                if (ret.expiryDate) ret.expiryDate = ret.expiryDate.toISOString().split('T')[0];
            }
        }
    }
);

// Auto-compute status based on expiry date before saving
certificationSchema.pre('save', function (next) {
    if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
        this.status = 'expired';
    }
    next();
});

// Index for efficient user-based queries
certificationSchema.index({ userId: 1 });
certificationSchema.index({ status: 1 });

module.exports = mongoose.model('Certification', certificationSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    upcCode: {
        type: String,
        trim: true,
        default: ''
    },
    brand: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1']
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index: powers paginated dashboard queries (sorted by expiryDate per user)
productSchema.index({ userId: 1, expiryDate: 1 });

// Text index: powers search by product name
productSchema.index({ name: 'text' });

// Sparse index: powers UPC code lookups (only indexes docs that have a upcCode)
productSchema.index({ userId: 1, upcCode: 1 }, { sparse: true });

module.exports = mongoose.model('Product', productSchema);

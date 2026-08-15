const Product = require('../models/Product');

const productDao = {
    findAllByUserId: async (userId) => {
        return Product.find({ userId }).sort({ expiryDate: 1 });
    },

    findById: async (productId) => {
        return Product.findById(productId);
    },

    create: async (productData) => {
        const product = new Product(productData);
        return product.save();
    },

    deleteById: async (productId) => {
        return Product.findByIdAndDelete(productId);
    },

    updateById: async (productId, updateData) => {
        return Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
    }
};

module.exports = productDao;

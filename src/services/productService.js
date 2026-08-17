const productDao = require('../dao/productDao');

const productService = {
    getProductsByUser: async (userId, page, limit) => {
        return productDao.findAllByUserId(userId, page, limit);
    },

    searchProducts: async (userId, filters, page, limit) => {
        return productDao.searchProducts(userId, filters, page, limit);
    },

    addProduct: async (userId, productData) => {
        return productDao.create({ ...productData, userId });
    },

    updateProduct: async (userId, productId, updateData) => {
        const product = await productDao.findById(productId);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.userId.toString() !== userId.toString()) {
            const error = new Error('Unauthorized: You do not own this product');
            error.statusCode = 403;
            throw error;
        }
        return productDao.updateById(productId, updateData);
    },

    removeProduct: async (userId, productId) => {
        const product = await productDao.findById(productId);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.userId.toString() !== userId.toString()) {
            const error = new Error('Unauthorized: You do not own this product');
            error.statusCode = 403;
            throw error;
        }
        return productDao.deleteById(productId);
    }
};

module.exports = productService;

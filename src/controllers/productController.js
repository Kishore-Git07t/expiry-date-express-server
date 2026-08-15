const { validationResult } = require('express-validator');
const productService = require('../services/productService');

const productController = {
    getProducts: async (request, response) => {
        try {
            const userId = request.user._id;
            const products = await productService.getProductsByUser(userId);
            return response.status(200).json({ products });
        } catch (error) {
            return response.status(500).json({
                message: error.message || 'Failed to fetch products'
            });
        }
    },

    addProduct: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = request.user._id;
            const { name, brand, category, expiryDate, quantity, notes } = request.body;

            const product = await productService.addProduct(userId, {
                name,
                brand,
                category,
                expiryDate,
                quantity,
                notes
            });

            return response.status(201).json({
                message: 'Product added successfully',
                product
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return response.status(statusCode).json({
                message: error.message || 'Failed to add product'
            });
        }
    },

    removeProduct: async (request, response) => {
        try {
            const userId = request.user._id;
            const { productId } = request.params;

            await productService.removeProduct(userId, productId);

            return response.status(200).json({
                message: 'Product removed successfully'
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return response.status(statusCode).json({
                message: error.message || 'Failed to remove product'
            });
        }
    }
};

module.exports = productController;

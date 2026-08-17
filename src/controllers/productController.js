const { validationResult } = require('express-validator');
const productService = require('../services/productService');

const productController = {
    getProducts: async (request, response) => {
        try {
            const userId = request.user._id;
            const page = parseInt(request.query.page, 10) || 1;
            const limit = parseInt(request.query.limit, 10) || 20;
            const data = await productService.getProductsByUser(userId, page, limit);
            return response.status(200).json(data);
        } catch (error) {
            return response.status(500).json({
                message: error.message || 'Failed to fetch products'
            });
        }
    },

    searchProducts: async (request, response) => {
        try {
            const userId = request.user._id;
            const page = parseInt(request.query.page, 10) || 1;
            const limit = parseInt(request.query.limit, 10) || 20;
            
            const filters = {
                q: request.query.q,
                upcCode: request.query.upcCode,
                category: request.query.category,
                expiryWithin: request.query.expiryWithin
            };

            const data = await productService.searchProducts(userId, filters, page, limit);
            return response.status(200).json(data);
        } catch (error) {
            return response.status(500).json({
                message: error.message || 'Failed to search products'
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
            const { name, upcCode, brand, category, expiryDate, quantity, notes } = request.body;

            const product = await productService.addProduct(userId, {
                name,
                upcCode,
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
    },

    updateProduct: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        
        try {
            const userId = request.user._id;
            const { productId } = request.params;
            const updateData = request.body;

            const product = await productService.updateProduct(userId, productId, updateData);

            return response.status(200).json({
                message: 'Product updated successfully',
                product
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return response.status(statusCode).json({
                message: error.message || 'Failed to update product'
            });
        }
    }
};

module.exports = productController;

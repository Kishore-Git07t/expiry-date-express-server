const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const authController = {
    register: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const { name, email, password } = request.body;
            const { user, token } = await authService.registerUser({ name, email, password });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            return response.status(201).json({
                message: 'User registered successfully',
                user,
                token
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return response.status(statusCode).json({
                message: error.message || 'Internal server error'
            });
        }
    },

    login: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const { email, password } = request.body;
            const { user, token } = await authService.loginUser({ email, password });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            return response.status(200).json({
                message: 'User authenticated',
                user,
                token
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return response.status(statusCode).json({
                message: error.message || 'Invalid email or password'
            });
        }
    }
};

module.exports = authController;

const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// All product routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products for the authenticated user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user products
 *       401:
 *         description: Unauthorized
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - expiryDate
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required').isISO8601().withMessage('Expiry date must be a valid date'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], productController.addProduct);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Remove a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       403:
 *         description: Forbidden - not your product
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:productId', productController.removeProduct);

module.exports = router;

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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of user products
 *       401:
 *         description: Unauthorized
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search and filter products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Text search on product name
 *       - in: query
 *         name: upcCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: expiryWithin
 *         schema:
 *           type: integer
 *           description: Days until expiry
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Filtered list of products
 *       401:
 *         description: Unauthorized
 */
router.get('/search', productController.searchProducts);

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
 *               upcCode:
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
    body('upcCode').optional().isString().trim(),
    body('expiryDate').notEmpty().withMessage('Expiry date is required').isISO8601().withMessage('Expiry date must be a valid date'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], productController.addProduct);

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               upcCode:
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
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - not your product
 *       404:
 *         description: Product not found
 */
router.put('/:productId', [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('upcCode').optional().isString().trim(),
    body('expiryDate').optional().isISO8601().withMessage('Expiry date must be a valid date'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], productController.updateProduct);

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

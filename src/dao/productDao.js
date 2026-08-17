const Product = require('../models/Product');

const productDao = {
    findAllByUserId: async (userId, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const [products, totalProducts] = await Promise.all([
            Product.find({ userId }).sort({ expiryDate: 1 }).skip(skip).limit(limit),
            Product.countDocuments({ userId })
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                hasNextPage: page * limit < totalProducts,
                hasPrevPage: page > 1
            }
        };
    },

    searchProducts: async (userId, filters, page = 1, limit = 20) => {
        const query = { userId };

        if (filters.q) {
            query.$text = { $search: filters.q };
        }
        if (filters.upcCode) {
            query.upcCode = { $regex: `^${filters.upcCode}` }; // Prefix match
        }
        if (filters.category) {
            query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
        }
        if (filters.expiryWithin) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + parseInt(filters.expiryWithin, 10));
            query.expiryDate = { $gte: today, $lte: futureDate };
        }

        const skip = (page - 1) * limit;
        
        let dbQuery = Product.find(query);
        // If searching by text, sort by text score, else by nearest expiry
        if (filters.q) {
            dbQuery = dbQuery.sort({ score: { $meta: "textScore" } });
        } else {
            dbQuery = dbQuery.sort({ expiryDate: 1 });
        }

        const [products, totalProducts] = await Promise.all([
            dbQuery.skip(skip).limit(limit),
            Product.countDocuments(query)
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                hasNextPage: page * limit < totalProducts,
                hasPrevPage: page > 1
            },
            filters
        };
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

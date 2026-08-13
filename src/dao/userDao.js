const User = require('../models/User');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
    createUser: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },
    findById: async (id) => {
        return await User.findById(id);
    }
};

module.exports = userDao;

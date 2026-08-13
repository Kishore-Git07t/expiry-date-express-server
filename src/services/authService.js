const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const authService = {
    registerUser: async ({ name, email, password }) => {
        const existingUser = await userDao.findByEmail(email);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userDao.createUser({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            process.env.JWT_SECRET || 'expiry_date_manager_secret_key',
            { expiresIn: '1h' }
        );

        // Convert Mongoose doc to plain object and exclude password
        const userObj = newUser.toObject();
        delete userObj.password;

        return { user: userObj, token };
    },

    loginUser: async ({ email, password }) => {
        const user = await userDao.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            throw error;
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            throw error;
        }

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET || 'expiry_date_manager_secret_key',
            { expiresIn: '1h' }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return { user: userObj, token };
    }
};

module.exports = authService;

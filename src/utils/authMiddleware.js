const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
    // Try Authorization header first, then cookie
    let token = null;

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (request.cookies && request.cookies.jwtToken) {
        token = request.cookies.jwtToken;
    }

    if (!token) {
        return response.status(401).json({
            message: 'Unauthorized: No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expiry_date_manager_secret_key');
        request.user = decoded;
        next();
    } catch (error) {
        return response.status(401).json({
            message: 'Unauthorized: Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;

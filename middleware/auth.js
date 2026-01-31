const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];
        const userId = req.headers['x-user-id'];

        if (!userRole) {
            return res.status(401).json({ message: 'Unauthorized: x-user-role header missing' });
        }

        if (role && userRole !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        // Attach user info to request
        req.user = {
            role: userRole,
            id: userId
        };

        next();
    };
};

module.exports = { checkRole };

const { verifyToken } = require('../utils/auth.js');
const pool = require('../query.js');

const verify = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if (!bearerHeader) {
            return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
        }
        const token = bearerHeader.split(' ')[1];
        const decodedToken = verifyToken(token);

        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Unauthorized: Token does not contain user ID' });
        }
        pool.query('SELECT * FROM users WHERE id=$1', [decodedToken.id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.rows.length === 0) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Forbidden: Token verification failed' });
    }
};

module.exports = verify;

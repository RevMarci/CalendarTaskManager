import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const currentUser = await User.findByPk(decoded.id);
            if (!currentUser) {
                return res.status(401).json({ message: 'The user associated with the token no longer exists.' });
            }

            req.user = currentUser;
            next();

        } catch (error) {
            console.error('Token error:', error);
            return res.status(401).json({ message: 'You are not logged in or the token is invalid.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, access denied.' });
    }
};
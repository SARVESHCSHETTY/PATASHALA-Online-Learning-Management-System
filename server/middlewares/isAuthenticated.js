import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated (no token)"
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or malformed token"
            });
        }
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated (decode failed)"
            });
        }
        req.id = decoded.userId;
        // Attach user object for downstream middlewares
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in authentication"
        });
    }
}
export default isAuthenticated;
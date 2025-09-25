import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const verifyJWT = asyncHandler( async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        throw new ApiError(401, "Unauthorized: No token provided!")
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            throw new ApiError(401, "User not found!");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token!")
    }
})

export { verifyJWT as protect};
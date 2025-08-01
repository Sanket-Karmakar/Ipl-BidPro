import { User } from '..user.models.js'
import { ApiError } from '..ApiError.js'
import { ApiResponse } from '..ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler( async (req, res) => {
    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password || !fullname){
        throw new ApiError(400, "All fields are required!");
    }

    const existingUser = await User.finOne({ email });

    if (existingUser){
        throw new ApiError(409, "User is already registered with this email");
    }

    const user = await User.create({})
})
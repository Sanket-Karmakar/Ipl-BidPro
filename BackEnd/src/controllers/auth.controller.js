import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const user = await User.create({ fullname, username, email, password });

  const userData = user.toObject();
  delete userData.password;

  return res
    .status(201)
    .json(new ApiResponse(201, userData, "User registered successfully!"));
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Both fields are required!");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials!");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json(
    new ApiResponse(
      200,
      { user: userData, accessToken, refreshToken },
      "User successfully logged in!"
    )
  );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.body.refreshToken;

    if (!incomingToken){
        throw new ApiError(400, "Refresh token is required!");
    }

    try{
        const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== incomingToken){
            throw new ApiError(401, "Invalid refresh token!")
        }

        const newAccessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({validateBeforeSave: false});

        res.status(200).json(
            new ApiResponse(200, {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }, "Token Refreshed")
        );
    }
    catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token!");
    }

});

export { registerUser, loginUser, refreshAccessToken };


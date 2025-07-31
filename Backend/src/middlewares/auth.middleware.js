import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req,res,next) => {
    const bearerToken = req.headers["authorization"];
    // console.log(req);
    const token = req.cookies?.accessToken || (bearerToken?.startsWith("Bearer ") ? bearerToken.slice(7) : null);
    // console.log("token:", token);

    if (!token) {
        throw new ApiError(401, "Unauthorized Access - No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Error:", err.name, err.message);
        throw new ApiError(401, `Malformed or Invalid JWT: ${err.message}`);
    }
});

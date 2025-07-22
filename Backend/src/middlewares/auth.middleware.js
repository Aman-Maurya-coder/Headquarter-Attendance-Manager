import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { jwt } from "jsonwebtoken";


export const authMiddleware = asyncHandler( async (req, _, next ) => {
    try {
        const token = req?.cookies?.token || req.headers["Authorization"]?.replace("Bearer ", "");
        if (!token){
            throw new ApiError(401, "Unauthorized Access");
        }
        const decoded_token = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decoded_token._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(404, "Invalid Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})
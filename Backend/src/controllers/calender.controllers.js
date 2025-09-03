import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Schedule } from "../models/schedule.model.js";
import { Subject } from "../models/subject.model.js";
import { getAuth } from "@clerk/express";


export const dateSubjects = asyncHandler(async (req, res) => {
    const user = await User.findOne({ clerk_id: req.auth.userId });
    const user_id = user._id;
    const { date } = req.query;
    if (!date) {
        throw new ApiError(400, "Date is required");
    }
    const formattedDate = new Date(date);
    const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999));
    const subjects = await Subject.find({
        user_id: user_id,
        days: { $elemMatch: { $gte: startOfDay, $lte: endOfDay } }
    }).populate("user_id", "name email");
})
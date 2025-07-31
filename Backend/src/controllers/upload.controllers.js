import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Schedule } from "../models/schedule.model.js";
import { Subject } from "../models/subject.model.js";

// {
//     "sub_name": "operating system",
//     "sub_code": "csmc101",
//     "days": [
//         "Monday",
//         "Tuesday"
//     ],
//     "present": "0",
//     "absent": "0",
//     "cancelled": "0"
// }

export const addSubject = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const { sub_name, sub_code, days, present, absent, cancelled } = req.body;
    
    present = Number(present);
    absent = Number(absent);
    cancelled = Number(cancelled);

    if (!sub_name || !sub_code || (!days && days.length === 0) || present === undefined || absent === undefined || cancelled === undefined) {
        throw new ApiError(400, "All fields are required");
    }
    
    const subjectAlreadyExist = await Subject.find(
        { user_id },
        { subjCode: sub_code.toLowerCase() }
    );
    
    if (subjectAlreadyExist.length > 0) {
        throw new ApiError(409, "Subject with this code already exists");
    }

    // Creates a new subject and saves it to the database
    try {
        const subject = await Subject.create({
            name: sub_name.toLowerCase(),
            subjCode: sub_code.toLowerCase(),
            totalClasses: present + absent + cancelled,
            attendedClasses: present,
        });

        const subjectId = subject._id;

        const updatedDays = {};
        for (const day of days) {
            updatedDays[`timetable.${day}`] = { $each: [subjectId] };
        }

        // Update the user's schedule with the new subject
        await Schedule.findOneAndUpdate(
            { user_id },
            { $push: updatedDays },
            { new: true, upsert: true }
        );
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new ApiError(400, "Validation error", [error.message]);
        } else if (error.code === 11000) {
            throw new ApiError(409, "Duplicate key error", [error.message]);
        } else {
            throw new ApiError(500, "Internal server error", [error.message]);
        }
    }

    // Respond with success
    res.status(200).json(
        new ApiResponse(200, "Subject added successfully", {
            sub_name
        })
    );
})

export const getSubjects = asyncHandler(async (req, res) => {
    const user_id = req.user;
    console.log(user_id);
    // all subjects for the user
    const schedule = await Schedule.findOne({ user_id }).populate({
        path: 'timetable.monday timetable.tuesday timetable.wednesday timetable.thursday timetable.friday timetable.saturday timetable.sunday',
        model: 'Subject'
    }).lean();

    const resp = schedule.timetable || {};

    res.status(200).json({
        status: 200,
        message: "Subjects fetched successfully",
        data: resp
    });
})

export const deleteSubject = asyncHandler(async (res, req) => {
    const user_id = req.user._id;
    const { sub_code } = req.body;
    if (!sub_code) {
        throw new ApiError(400, "Subject code is required");
    }
    const subjectId = sub_code.toLowerCase();

    await Schedule.updateOne(
        { user_id: user_id },
        {
        $pull: {
            'timetable.monday': subjectId,
            'timetable.tuesday': subjectId,
            'timetable.wednesday': subjectId,
            'timetable.thursday': subjectId,
            'timetable.friday': subjectId,
            'timetable.saturday': subjectId,
            'timetable.sunday': subjectId,
        }
        }
    );
    
      // 2. Remove from all attendance records
    await Attendance.updateMany(
        { user_id },
        { $pull: { attendance: { subjectId: new mongoose.Types.ObjectId(subjectId) } } }
    );
    
      // 3. Finally, delete the subject itself
    await Subject.deleteOne({ _id: subjectId, userId });
})
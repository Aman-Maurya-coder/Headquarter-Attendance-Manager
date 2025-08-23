import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Schedule } from "../models/schedule.model.js";
import { Subject } from "../models/subject.model.js";
import { Attendance } from "../models/attendance.model.js"

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const getDateData = asyncHandler(async (req, res) => {
    console.log("getDateData" );
    const userId = req.user._id;
    const { req_date } = req.body;
    if (!req_date) {
        throw new ApiError(400, "Date is required.");
    }
    let date = new Date(req_date);
    let day = days[date.getDay()]; // 0-6 (0 is Sunday, 1 is Monday, etc.)
    // console.log(day , date);
    
    try{
        const attendance = await Attendance.findOne({ user_id: userId, date: date.toISOString().split('T')[0] }).populate('subjects_attendance.subjectId', 'name code').lean();
        if (attendance) {
            const subjects_attendance = attendance?.subjects_attendance;
            console.log(subjects_attendance);
            if (subjects_attendance) {
                return res.status(200).json({
                    status: 200,
                    message: "Attendance data fetched successfully",
                    data: subjects_attendance || [],
                });
            }
        }
    } catch (error) {
        throw new ApiError(510, "Attendance fetching failed.");
    }
    try{
        const schedule = await Schedule.findOne({ user_id: userId }).populate({
            path: 'timetable.monday.subjectId timetable.tuesday.subjectId timetable.wednesday.subjectId timetable.thursday.subjectId timetable.friday.subjectId timetable.saturday.subjectId timetable.sunday.subjectId',
            model: 'Subject'
        }).lean();
        // console.log("Schedule",schedule);
        if (!schedule) {
            throw new ApiError(511, "No schedule available.");
        }
        const resp = schedule.timetable || {};
        if (!resp) {
            throw new ApiError(512, "Subjects fetching failed.");
        }
        // console.log("timeTable ", resp);
        const currentDaySubjects = resp[day] || [];
        if (currentDaySubjects.length === 0) {
            throw new ApiError(513, "No subjects scheduled for today.");
        }
        // console.log(currentDaySubjects);
        const attendanceEntries = currentDaySubjects.map(sub => ({
            subjectId: sub.subjectId._id,
            status: "pending"
        }));
        const newAttendance = new Attendance({
            user_id: userId,
            date: date.toISOString().split('T')[0],
            subjects_attendance: attendanceEntries
        });
        try{
            await newAttendance.save();
        }
        catch(error){
            console.log("Attendance creation error:", error);
            throw new ApiError(514, "Failed to create attendance record.");
        }
        res.status(200).json({
        status: 200,
        message: "Subjects fetched successfully",
        data: currentDaySubjects,
        });
    }
    catch (error) {
        console.log(error);
        throw new ApiError(513, "Subjects fetching failed. In try and error");
    }
});

export const subjectWiseAttendance = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const subject_id = req.params.subjectId;
    const req_date = req.params.curr_date;
    const subj_status = req.params.status; // present or absent or cancel
    if (!req_date) {
        throw new ApiError(400, "Date is required.");
    }
    if (!subj_status || !['present', 'absent', 'cancel'].includes(subj_status)) {
        throw new ApiError(501, "Valid status is required (present, absent, cancel).");
    }
    const date = new Date(req_date);
    const day = days[date.getDay()]; // 0-6 (0 is Sunday, 1 is Monday, etc.)
    if (!subject_id) {
        throw new ApiError(505, "Subject ID is required.");
    }
    const subject = await Subject.findOne({ _id: subject_id, user_id: userId});
    if (!subject) {
        throw new ApiError(504, "Subject not found.");
    }
    try{
        const attendance = await Attendance.findOne({ user_id: userId, date: date.toISOString().split('T')[0] }).populate('subjects_attendance.subjectId', 'name code');
        if (!attendance) {
            throw new ApiError(506, "No attendance record found for the given date.");
        }
        const subjectAttendance = attendance.subjects_attendance.find(sub => sub.subjectId.toString() === subject_id);
        if (!subjectAttendance) {
            throw new ApiError(507, "Subject not found in attendance record for the given date.");
        }
        subjectAttendance.status = subj_status;
        await attendance.save();
        res.status(200).json({
            status: 200,
            message: "Subject attendance updated successfully",
            data: subjectAttendance,
        });
    } catch (error) {
        throw new ApiError(508, "Subject attendance update failed.");
    }


});

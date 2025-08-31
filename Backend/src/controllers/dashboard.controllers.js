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
    let timetable;
    const schedule = await Schedule.findOne({ user_id: userId }).populate({
        path: 'timetable.monday.subjectId timetable.tuesday.subjectId timetable.wednesday.subjectId timetable.thursday.subjectId timetable.friday.subjectId timetable.saturday.subjectId timetable.sunday.subjectId',
        model: 'Subject'
    }).lean();
    
    if (!schedule) {
        throw new ApiError(404, "No schedule available for this user.");
    }
    timetable = schedule.timetable;
    if (!timetable) {
        throw new ApiError(404, "Timetable is empty for this user.");
    }
    // const timetable = userSchedule["timetable"];
    const currentDaySubjects = timetable[day] || [];
    try{
        const attendance = await Attendance.findOne({ user_id: userId, date: date.toISOString().split('T')[0] }).populate('subjects_attendance.subjectId').lean();
        if (attendance) {
            const subjects_attendance = attendance?.subjects_attendance;
            // console.log("running")
            // console.log(subjects_attendance, currentDaySubjects);
            if (subjects_attendance && subjects_attendance.length === currentDaySubjects.length) {
                return res.status(200).json({
                    status: 200,
                    message: "Attendance data fetched successfully",
                    data: subjects_attendance || [],
                });
            }
            else{
                const newSubjects = currentDaySubjects.filter((sub) => {
                    return !subjects_attendance.some((attSub) => attSub.subjectId.subjCode === sub.subjectId.subjCode);
                })
                if (newSubjects.length > 0){
                    const newAttendanceEntries = newSubjects.map(sub => ({
                        subjectId: sub.subjectId,
                        status: "pending"
                    }));
                    attendance.subjects_attendance.push(...newAttendanceEntries);
                    await Attendance.updateOne(
                        { user_id: userId, date: date.toISOString().split('T')[0] },
                        { subjects_attendance: attendance.subjects_attendance }
                    );
                }
                return res.status(200).json(
                    new ApiResponse(200, "Attendance data fetched successfully", attendance.subjects_attendance || [])
                )
            }
        }
    } catch (error) {
        throw new ApiError(510, "Existing Attendance record fetching failed.");
    }
    try{
        // console.log(currentDaySubjects);
        const attendanceEntries = currentDaySubjects.map(sub => ({
            subjectId: sub.subjectId,
            status: "pending"
        }));
        // console.log("Attendance Entries", attendanceEntries);
        try{
            await Attendance.findOneAndUpdate(
                { user_id: userId, date: date.toISOString().split('T')[0] },
                {
                    user_id: userId,
                    date: date.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
                    subjects_attendance: attendanceEntries
                },
                { 
                    new: true, 
                    upsert: true, 
                    setDefaultsOnInsert: true
                }
            ).populate('subjects_attendance.subjectId', 'name subjCode').lean();
        }
        catch(error){
            console.log("Attendance creation error:", error);
            if (error.code === 11000) {
                // If duplicate key error, try to fetch the existing record
                const existingAttendance = await Attendance.findOne({ 
                    user_id: userId, 
                    date: date.toISOString().split('T')[0] 
                }).populate('subjects_attendance.subjectId', 'name subjCode').lean();
                
                if (existingAttendance) {
                    return res.status(200).json({
                        status: 200,
                        message: "Attendance data fetched successfully",
                        data: existingAttendance.subjects_attendance || [],
                    });
                }
            }
            throw new ApiError(514, "Failed to create attendance record.");
        }
        res.status(200).json(
            new ApiResponse(200, "Attendance data fetched successfully", attendanceEntries || [])
        );
    }
    catch (error) {
        console.log(error);
        throw new ApiError(513, "Subjects fetching failed. In try and error");
    }
});

export const subjectWiseAttendance = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { subject_id , req_date ,subj_status} = req.body;

    if (!req_date) {
        throw new ApiError(400, "Date is required.");
    }
    if (!subj_status || !['present', 'absent', 'cancel', 'pending'].includes(subj_status)) {
        throw new ApiError(501, "Valid status is required (present, absent, cancel).");
    }
    const date = new Date(req_date);
    const day = days[date.getDay()]; // 0-6 (0 is Sunday, 1 is Monday, etc.)
    if (!subject_id) {
        throw new ApiError(505, "Subject ID is required.");
    }
    const subject = await Subject.findOne({ subjCode: subject_id, user_id: userId});
    if (!subject) {
        throw new ApiError(504, "Subject not found.");
    }
    try{
        const attendance = await Attendance.findOne({ user_id: userId, date: date.toISOString().split('T')[0] }).populate('subjects_attendance.subjectId', "name subjCode");
        if (!attendance) {
            throw new ApiError(506, "No attendance record found for the given date.");
        }
        console.log("Attendance ", attendance.subjects_attendance[0].subjectId);
        const subjectAttendance = attendance.subjects_attendance.find(sub => sub.subjectId.subjCode === subject_id);
        console.log("Subject Attendance", subjectAttendance);
        if (!subjectAttendance) {
            throw new ApiError(507, "Subject not found in attendance record for the given date.");
        }
        if (subjectAttendance.status === "pending" && subj_status !== "cancel" && subj_status !== "pending"){
            if (subj_status === "present") {
                subject.totalClasses += 1;
                subject.attendedClasses += 1;
            }
            else if (subj_status === "absent"){
                subject.totalClasses += 1;
                subject.missedClasses += 1;
            }
        }
        else if (subjectAttendance.status === "pending" && subj_status === "cancel"){
            subject.cancelledClasses += 1;
        }
        else{
            if (subjectAttendance.status === subj_status ){
                res.status(200).json({
                    status: 200,
                    message: "Subject attendance already marked as " + subj_status,
                    data: subjectAttendance,
                })
            }
            else if (subjectAttendance.status === "present" && subj_status === "absent"){
                subject.attendedClasses = Math.max(0, subject.attendedClasses - 1);
                subject.missedClasses += 1;
            }
            else if (subjectAttendance.status === "present" && subj_status === "cancel"){
                subject.attendedClasses = Math.max(0, subject.attendedClasses - 1);
                subject.cancelledClasses += 1;
                subject.totalClasses -= 1;
            }
            else if (subjectAttendance.status === "present" && subj_status === "pending"){
                subject.attendedClasses = Math.max(0, subject.attendedClasses - 1);
                console.log("total classes :", subject.totalClasses);
                subject.totalClasses = Math.max(0, subject.totalClasses - 1);
                console.log("total classes :", subject.totalClasses);
            }
            else if (subjectAttendance.status === "absent" && subj_status === "present"){
                subject.missedClasses = Math.max(0, subject.missedClasses - 1);
                subject.attendedClasses += 1;
            }
            else if (subjectAttendance.status === "absent" && subj_status === "cancel"){
                subject.missedClasses = Math.max(0, subject.missedClasses - 1);
                subject.cancelledClasses += 1;
                subject.totalClasses -= 1;
            }
            else if (subjectAttendance.status === "absent" && subj_status === "pending"){
                subject.missedClasses = Math.max(0, subject.missedClasses - 1);
                subject.totalClasses -= Math.max(0, subject.totalClasses - 1);
            }
            else if (subjectAttendance.status === "cancel" && subj_status === "present"){
                subject.cancelledClasses = Math.max(0, subject.cancelledClasses - 1);
                subject.attendedClasses += 1;
                subject.totalClasses += 1;
            }
            else if (subjectAttendance.status === "cancel" && subj_status === "absent"){
                subject.cancelledClasses = Math.max(0, subject.cancelledClasses - 1);
                subject.missedClasses += 1;
                subject.totalClasses += 1;
            }
            else if (subjectAttendance.status === "cancel" && subj_status === "pending"){
                subject.cancelledClasses = Math.max(0, subject.cancelledClasses -1);
            }
        }
        await subject.save();
        subjectAttendance.status = subj_status;
        console.log("Updated Subject Attendance", subjectAttendance);
        await attendance.save();
        res.status(200).json({
            status: 200,
            message: "Subject attendance updated successfully",
            data: subjectAttendance,
        });
    } catch (error) {
        console.log(error);
        throw new ApiError(513, "Subject attendance update failed.");
    }


});

// export const extraClass = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const { subject_id , req_date ,subj_status} = req.body;
//     if (!req_date) {
//         throw new ApiError(400, "Date is required.");
//     }
//     if (!subj_status || !['present', 'absent', 'cancel', 'pending'].includes(subj_status)) {
//         throw new ApiError(501, "Valid status is required (present, absent, cancel).");
//     }
//     const date = new Date(req_date);
//     const day = days[date.getDay()]; // 0-6 (0 is Sunday, 1 is Monday, etc.)
//     if (!subject_id) {
//         throw new ApiError(505, "Subject ID is required.");
//     }
//     const subject = await Subject.findOne({ subjCode: subject_id, user_id: userId});
//     if (!subject) {
//         throw new ApiError(504, "Subject not found.");
//     }
//     try{
//         const newAttendance = 
//     }
// })

export const subjectsData = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const subjects = await Subject.find({
        user_id: userId
    })
    if (!subjects){
        throw new ApiError(404, "No subjects found for this user.");
    }
    res.status(200).json({
        status: 200,
        message: "Subjects fetched successfully",
        data: subjects,
    });
})

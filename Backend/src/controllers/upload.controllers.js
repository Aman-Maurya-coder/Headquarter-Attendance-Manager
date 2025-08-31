import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
  let { sub_name, sub_code, days, present, absent, cancelled } = req.body;
    // console.log(req.body);
  present = Number(present);
  absent = Number(absent);
  cancelled = Number(cancelled);

  if (
    !sub_name ||
    !sub_code ||
    (!days && days.length === 0) ||
    present === undefined ||
    absent === undefined ||
    cancelled === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const subjectAlreadyExist = await Subject.find(
    { user_id: user_id, // Match by user ID
    subjCode: sub_code.toLowerCase() // Also match by subject code 
},
  );
  console.log("subjectAlreadyExist:", subjectAlreadyExist);

  if (subjectAlreadyExist.length > 0) {
    throw new ApiError(409, "Subject with this code already exists");
  }

  // Creates a new subject and saves it to the database
  try {
    console.log("Creating subject with name:", sub_name);
    const subject = await Subject.create({
        user_id,
      name: sub_name.toLowerCase(),
      subjCode: sub_code.toLowerCase(),
      totalClasses: present + absent,
      missedClasses: absent,
      cancelledClasses: cancelled,
      attendedClasses: present,
    });
    // console.log("Subject created:", subject);

    const subjectId = subject._id;

    const updatedDays = {};
    for (const day of days) {
        // CORRECTED LINE: Push an object with the 'subjectId' key
        updatedDays[`timetable.${day}`] = { $each: [{ subjectId: subjectId }] };
    }
    // console.log("Updated Days:", updatedDays);
    // Update the user's schedule with the new subject
    try {
      const updatedSchedule = await Schedule.findOneAndUpdate(
        { user_id },
        { $push: updatedDays },
        { new: true, upsert: true } // new: true returns the modified document rather than the original. upsert: true creates the object if it doesn't exist.
      );

      if (updatedSchedule) {
        console.log(
          "Operation successful. Document updated or upserted:",
          updatedSchedule
        );
        // You can also check if it was an insert or an update if needed.
        // For example, if you had a field like 'createdAt' and 'updatedAt',
        // you could compare them to see if it's a brand new document.
        // Or, if you know the initial state of the collection for user_id,
        // you could infer if it was an upsert.
        // return { success: true, data: updatedSchedule };
      } else {
        // This block might theoretically be hit if an unexpected null is returned,
        // though with upsert: true, it should typically always return a document on success.
        console.log(
          "Operation did not return a document, might indicate an issue."
        );
        // return {
        //   success: false,
        //   message: "No document returned from update/upsert.",
        // };
      }
    } catch (error) {
      console.error("Error during findOneAndUpdate operation:", error);
      // Handle the error (e.g., send an error response to the client)
    //   return {
    //     success: false,
    //     message: error.message || "An unknown error occurred.",
    //   };
    }


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
  return res.status(200).json(
    new ApiResponse(200, "Subject added successfully", {
      sub_name,
    })
  );
});

export const getSubjects = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
//   console.log(user_id);
  // all subjects for the user
  const schedule = await Schedule.findOne({ user_id }).populate({
        path: 'timetable.monday.subjectId timetable.tuesday.subjectId timetable.wednesday.subjectId timetable.thursday.subjectId timetable.friday.subjectId timetable.saturday.subjectId timetable.sunday.subjectId',
        model: 'Subject'
    }).lean();
  console.log(schedule);

  const resp = schedule?.timetable || {};

  res.status(200).json({
    status: 200,
    message: "Subjects fetched successfully",
    data: resp,
  });
});

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
        "timetable.monday": subjectId,
        "timetable.tuesday": subjectId,
        "timetable.wednesday": subjectId,
        "timetable.thursday": subjectId,
        "timetable.friday": subjectId,
        "timetable.saturday": subjectId,
        "timetable.sunday": subjectId,
      },
    }
  );

  // 2. Remove from all attendance records
  await Attendance.updateMany(
    { user_id },
    {
      $pull: {
        attendance: { subjectId: new mongoose.Types.ObjectId(subjectId) },
      },
    }
  );

  // 3. Finally, delete the subject itself
  await Subject.deleteOne({ _id: subjectId, userId });
});

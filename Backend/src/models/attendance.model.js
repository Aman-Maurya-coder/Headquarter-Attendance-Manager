import { Schema, model } from "mongoose";

const attendanceSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    subjects_attendance: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent", "cancelled", "pending"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ "attendance.subjectId": 1 });
attendanceSchema.index({
  userId: 1,
  "attendance.subjectId": 1,
  "attendance.status": 1,
});

attendanceSchema.post("save", async function (doc) {
  try {
    // Iterate over each attendance record in the document
    for (const entry of doc.attendance) {
      if (!entry.subjectId) continue;

      // Increment totalClasses
      await Subject.findByIdAndUpdate(entry.subjectId, {
        $inc: {
          totalClasses: 1,
          attendedClasses: entry.status === "present" ? 1 : 0,
        },
      });
    }
  } catch (err) {
    console.error("Error updating subject attendance:", err);
  }
});

export const Attendance = model("Attendance", attendanceSchema);

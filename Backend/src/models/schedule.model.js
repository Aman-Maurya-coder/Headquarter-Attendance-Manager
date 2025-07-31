import { Schema, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Should be a string representing the model name
      required: true,
    },
    timetable: {
      monday: [{ subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } }],
      tuesday: [{ subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } }],
      wednesday: [
        { subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } },
      ],
      thursday: [
        { subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } },
      ],
      friday: [{ subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } }],
      saturday: [
        { subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } },
      ],
      sunday: [{ subjectId: { type: Schema.Types.ObjectId, ref: "Subject" } }],
    },
    totalTargetAttendance: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = model("Schedule", scheduleSchema);

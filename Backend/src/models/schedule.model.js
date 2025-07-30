import {Schema, model} from 'mongoose';


const scheduleSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Should be a string representing the model name
        required: true
    },
    timetable: {
        Monday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Tuesday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Wednesday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Thursday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Friday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Saturday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
        Sunday: [{ subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' } }],
    },
    totalTargetAttendance:{
        type: Number,
        default: 0,
        required: true,
        min: 0,
        max: 100
    }
},{
    timestamps: true
})

export const Schedule = model('Schedule', scheduleSchema);

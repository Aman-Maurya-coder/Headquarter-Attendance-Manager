import {Schema, model} from 'mongoose';

const subjectSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Should be a string representing the model name
        required: true
    },
    name:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subjCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    totalClasses: { type: Number, default: 0 },         // total times class happened
    attendedClasses: { type: Number, default: 0 },     // total times user was present
    targetAttendance: {
        type: Number,
        default: 75,
        min: 0,
        max: 100
    },
},
{
    timestamps: true
}
)
export const Subject = model('Subject', subjectSchema);
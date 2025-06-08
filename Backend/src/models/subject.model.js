import {Schema, model} from 'mongoose';

const subjectSchema = new Schema({
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
    present: {
        type: Number,
        default: 0
    },
    absent: {
        type: Number,
        default: 0
    },
    classes: {
        type: Number,
        default: 0
    },
    targetAttendance: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
}
)

export const Subject = model('Subject', subjectSchema);
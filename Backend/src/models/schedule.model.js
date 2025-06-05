import {Schema, model} from 'mongoose';
import { Subject } from './subject.model';
import { User } from './user.model';
import { Day } from './day.model';

const scheduleSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    subject_info: {
        type: {
            subject_name: {
                type: Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
            },
            days: [{
                type: Schema.Types.ObjectId,
                ref: 'Day',
                required: true
            }]
        },
        required: true,
    },
    totalTargetAttendance:{
        type: Number,
        default: 0,
        required: true
    }
},{
    timestamps: true
})

export const Schedule = model('Schedule', scheduleSchema);

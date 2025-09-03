import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    clerk_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    first_name : {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    last_name : {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

},{
    timestamps: true
})

export const User = model('User', userSchema);
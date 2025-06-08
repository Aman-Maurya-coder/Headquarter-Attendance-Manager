import { Schema, model } from "mongoose";

const daySchema = new Schema({
    name:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    time: {
        type: [{
            start: Date,
            end: Date
        }],
        required: true
    }
},{
    timestamps: true
}
)

export const Day = model('Day', daySchema);
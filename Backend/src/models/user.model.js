import {Schema, model} from 'mongoose';
import { jwt } from 'jsonwebtoken';
import { bcrypt } from 'bcrypt';

const userSchema = new Schema({
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
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    refreshToken: {
        type: String,
        default: null
    }

},{
    timestamps: true
})

userSchema.pre('save', async function(next){  // pre-save hook to hash password
    if(!this.isModified('password')) return next(); // if password is not modified, skip hashing

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(password) { // method to compare password
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    jwt.sign({
        _id: this._id,
        email: this.email,
        first_name: this.first_name,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
    })
} // method to generate access token
userSchema.methods.generateRefreshToken = function() {
    jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d'
    })
} // method to generate refresh token

export const User = model('User', userSchema);
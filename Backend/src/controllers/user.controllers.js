import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens=async(userId)=>
    {
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return{ accessToken , refreshToken }

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refreshtoken")
    }
}

// Controller for registering a new user

const registerUser = asyncHandler(async (req, res) => {
  const {first_name, last_name, email, e_pw, c_pw } = req.body;
  console.log(req.body);

  if (!first_name || !last_name || !email || !e_pw || !c_pw) {
    throw new ApiError(400,"All fields are Required")
  }

  if (email === ""){
    throw new ApiError(400,"Email is Required")
  }

  if (!email.endsWith("@gmail.com")) {
    throw new ApiError(400,"Invalid Email")
  }

  if (e_pw.length < 8) {
    throw new ApiError(400,"Password must be at least 8 characters long")
  }

  const userExists = await User.findOne({email});
  if (userExists) {
    throw new ApiError(409,"Email already registered")
  }

  const user= await User.create({
    first_name,
    last_name,
    email,
    password:e_pw,
  })

  const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser){
    throw new ApiError(500,"Something went wrong")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )
})


// Controller for logging in a user

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password}=req.body

    if (!password || !email){
        throw new ApiError(400,"email or password is required")
    }
    const user= await User.findOne({
        $or:[{ email }]
    })

    if(!user){
        throw new ApiError(404,"User doen not exist")
    }
    const isPasswordValid= await user.isPasswordCorrect(password)
     if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials")
    }
    const {accessToken,refreshToken}= await
     generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true,
        sameSite:"Lax",
    }
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,
                refreshToken
            },
            "user logged in Successfully"
        )
    )
  
})

// controller for logging out a user

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:null
            }
        },
        {
            new:true
        }
)
const options={
        httpOnly:true,
        secure:true,
        sameSite:"Lax",
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out "))
})

export { registerUser, loginUser, logoutUser};
